import { useRef, useState } from 'react';
import { ECamp, Gobang } from './core';
import styles from './styles.module.less';
import cls from 'classnames';
import React from 'react';
import { Button, message } from 'antd';
import escodegen from 'escodegen';

const gridsNumber = 10;

const getCellSize = (gridsNumber) => {
  return Math.floor(750 / gridsNumber);
};

const getPieceSize = (cellSize) => {
  return (cellSize * 4) / 5;
};

const getStyle = (camp: ECamp) => {
  switch (camp) {
    case ECamp.black: {
      return styles['piece-black'];
    }
    case ECamp.white: {
      return styles['piece-white'];
    }
    case ECamp.noChessPieces:
    default: {
      return '';
    }
  }
};

export const GobangRender: React.FunctionComponent = () => {
  const board = useRef<HTMLDivElement>(null);
  const cellSize = getCellSize(gridsNumber);
  const boxSize = (gridsNumber - 1) * cellSize + 1;
  const pieceSize = getPieceSize(cellSize);
  const gobang = useRef(new Gobang({ gridsNumber }));
  const [, setCamp] = useState(0);

  const getPiece = async (_camp: ECamp) => {
    const board = (gobang?.current?.battlefield ?? []).map((row) => {
      return (row ?? []).map((piece) => {
        /* 空位置显示0 */
        if (piece?.camp === ECamp.noChessPieces) {
          return 0;
        }
        /* 己方位置显示1 */
        if (piece?.camp === _camp) {
          return 1;
        }
        /* 对方位置显示-1 */
        return -1;
      });
    });
    switch (_camp) {
      case ECamp.black: {
        const [row, column] = await window?.gobang?.player1Run(board);
        return gobang?.current?.battlefield?.[row]?.[column];
      }
      case ECamp.white: {
        const [row, column] = await window?.gobang?.player2Run(board);
        return gobang?.current?.battlefield?.[row]?.[column];
      }
      default: {
        throw new Error(`camp类型错误，${_camp}`);
      }
    }
  };

  const handleRun = async (_camp: ECamp) => {
    console.log('_camp', _camp);
    const st = setTimeout(() => {
      throw new Error(`${_camp}运行超时`);
    }, 60000);
    const piece = await getPiece(_camp);
    if (piece?.camp !== ECamp.noChessPieces) {
      message.error('当前位置已存在棋子');
      throw new Error(`当前位置已存在棋子`);
    }
    if (piece) {
      gobang?.current?.handlePlacingPiece(piece, _camp);
      /* 清除定时报错 */
      clearTimeout(st);
      setCamp(_camp);
      return;
    }
    clearTimeout(st);
    throw new Error(`未获取到有效节点`);
  };

  const handleTakeTurnsExec = async (_camp: ECamp) => {
    if (gobang?.current?.finish) {
      return;
    }
    await handleRun(_camp);
    setTimeout(() => {
      handleTakeTurnsExec(_camp === ECamp.black ? ECamp.white : ECamp.black);
    }, 500);
  };

  return (
    <div className={styles['gobang']}>
      <div className={styles['board']}>
        <div className={styles['board-inner']}>
          <div ref={board} style={{ width: boxSize }} className={styles['line-box']}>
            {new Array(Math.pow(gridsNumber - 1, 2)).fill(1).map((_, key) => {
              return <div key={key} className={styles['cell']} style={{ width: cellSize, height: cellSize }}></div>;
            })}
            {gobang.current?.battlefield.map((row) => {
              return row.map((piece) => {
                return (
                  <div
                    key={`${piece?.row}-${piece?.column}`}
                    className={cls(styles['piece-box'], getStyle(piece.camp))}
                    style={{
                      left: cellSize * piece?.column - pieceSize / 2,
                      top: cellSize * piece?.row - pieceSize / 2,
                      width: pieceSize,
                      height: pieceSize,
                    }}
                  ></div>
                );
              });
            })}
          </div>
        </div>
      </div>
      <div className={styles['aside']} style={{ height: boxSize }}>
        <Button
          onClick={() => {
            if (!gobang?.current?.finish) {
              message.info('对局正在运行，请稍等');
            }
            handleTakeTurnsExec(ECamp.black);
          }}
        >
          开始
        </Button>
      </div>
    </div>
  );
};
