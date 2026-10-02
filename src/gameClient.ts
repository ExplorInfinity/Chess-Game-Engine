import {Game} from "./game";

class GameClient
{
    private _currentMoveIndex: number = -1;
    private _gameInstance = new Game();

    // Board View
    public setToStartingView()
    {
        const { moveHistory } = this._gameInstance;
        for (let i = this._currentMoveIndex; i >= 0; --i)
            this._gameInstance.removeChanges(moveHistory[i]);

        this._currentMoveIndex = -1;
    }

    public setToLatestView()
    {
        const { moveHistory } = this._gameInstance;
        for (let i = this._currentMoveIndex + 1; i < moveHistory.length; ++i)
            this._gameInstance.applyChanges(moveHistory[i]);

        this._currentMoveIndex = moveHistory.length-1;
    }

    public forwardOneMove()
    {
        const { moveHistory } = this._gameInstance;
        if (this._currentMoveIndex + 1 >= moveHistory.length)
            return;

        this._gameInstance.applyChanges(moveHistory[++this._currentMoveIndex]);
    }

    public reverseOneMove()
    {
        const { moveHistory } = this._gameInstance;
        if (this._currentMoveIndex < 0)
            return;

        this._gameInstance.applyChanges(moveHistory[this._currentMoveIndex--]);
    }

}