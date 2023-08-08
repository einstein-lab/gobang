import { message } from 'antd';

export enum ECamp {
  noChessPieces,
  white,
  black,
}

export type Piece = {
  camp: ECamp;
  row: number;
  column: number;
};

export type GobangProps = {
  gridsNumber: number;
};

export const translateCamp = (camp: ECamp) => {
  switch (camp) {
    case ECamp.black: {
      return '黑棋';
    }
    case ECamp.white: {
      return '白棋';
    }
    case ECamp.noChessPieces:
    default: {
      return '';
    }
  }
};

export class Gobang {
  gridsNumber: number;

  battlefield: Piece[][];

  round: number;

  finish: boolean;

  winCamp: ECamp;

  constructor(props: GobangProps) {
    this.gridsNumber = props?.gridsNumber;
    this.handleInit();
  }

  handleInit() {
    this.winCamp = null;
    this.finish = false;
    this.round = 0;
    this.battlefield = this.#handleInitBattlefield();
  }

  #handleInitBattlefield() {
    return new Array(this.gridsNumber).fill(1).map((_, row) => {
      return new Array(this.gridsNumber).fill(1).map((_, column) => {
        return {
          camp: ECamp.noChessPieces,
          row,
          column,
        };
      });
    });
  }

  #getList = (list: number[][]) => (piece: Piece) => {
    return list.map(([offsetY, offsetX]) => {
      return this.battlefield?.[piece?.row + offsetY]?.[piece?.column + offsetX];
    });
  };

  #getTopLeftList = this.#getList([
    [-1, -1],
    [-2, -2],
    [-3, -3],
    [-4, -4],
  ]);

  #getTopList = this.#getList([
    [-1, 0],
    [-2, 0],
    [-3, 0],
    [-4, 0],
  ]);

  #getTopRightList = this.#getList([
    [-1, 1],
    [-2, 2],
    [-3, 3],
    [-4, 4],
  ]);

  #getRightList = this.#getList([
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ]);

  #getBottomRightList = this.#getList([
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
  ]);

  #getBottomList = this.#getList([
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
  ]);

  #getBottomLeftList = this.#getList([
    [1, -1],
    [2, -2],
    [3, -3],
    [4, -4],
  ]);

  #getLeftList = this.#getList([
    [0, -1],
    [0, -2],
    [0, -3],
    [0, -4],
  ]);

  #every<T>(list: T[], fn: (item: T, i: number) => boolean) {
    if (!list?.length) {
      return false;
    }
    return (list ?? []).every(fn);
  }

  /** 不传initPiece则校验全部节点 */
  #handleValidateIfCurrentCampWin() {
    /* 校验八个方向是否存在5连 */
    const checkIfSomeDirectionWin = (piece: Piece) => {
      const camp = piece?.camp;
      /* 校验左上 */
      if (this.#every(this.#getTopLeftList(piece), (item) => item?.camp === camp)) {
        return true;
      }
      /* 校验上方 */
      if (this.#every(this.#getTopList(piece), (item) => item?.camp === camp)) {
        return true;
      }
      /* 校验右上 */
      if (this.#every(this.#getTopRightList(piece), (item) => item?.camp === camp)) {
        return true;
      }
      /* 校验右方 */
      if (this.#every(this.#getRightList(piece), (item) => item?.camp === camp)) {
        return true;
      }
      /* 校验右下 */
      if (this.#every(this.#getBottomRightList(piece), (item) => item?.camp === camp)) {
        return true;
      }
      /* 校验下方 */
      if (this.#every(this.#getBottomList(piece), (item) => item?.camp === camp)) {
        return true;
      }
      /* 校验左下 */
      if (this.#every(this.#getBottomLeftList(piece), (item) => item?.camp === camp)) {
        return true;
      }
      /* 校验左方 */
      if (this.#every(this.#getLeftList(piece), (item) => item?.camp === camp)) {
        return true;
      }
      return false;
    };
    for (const row of this.battlefield) {
      for (const piece of row) {
        if (piece?.camp === ECamp.noChessPieces) {
          continue;
        }
        if (checkIfSomeDirectionWin(piece)) {
          console.log(piece);
          return true;
        }
      }
    }
    return false;
  }

  handlePlacingPiece(piece: Piece, camp: ECamp) {
    if (this.finish) {
      return message.info(`游戏结束了【${translateCamp(this.winCamp)}获胜】`);
    }
    if (piece.camp === ECamp.noChessPieces) {
      /* 黑棋先行 */
      this.battlefield[piece?.row][piece?.column] = {
        ...piece,
        camp,
      };
      this.round += 1;
      if (this.#handleValidateIfCurrentCampWin()) {
        this.finish = true;
        this.winCamp = camp;
        message.info(`${translateCamp(camp)}获胜`);
      }
    }
  }
}
