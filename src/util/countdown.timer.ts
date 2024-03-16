export default class CountdownTimer {
  private _timer: Timer;

  private _startMillis: number;
  private _currentMillis: number;

  private _isStarted: boolean;

  constructor(millis: number) {
    this._startMillis = millis;
    this._currentMillis = millis;
  }

  // Methods

  start() {
    this._timer = setInterval(() => {
      this._currentMillis -= 1000;
    }, 1000);
    this._isStarted = true;
  }

  pause() {
    clearInterval(this._timer);
    this._isStarted = false;
  }

  stop() {
    clearInterval(this._timer);
    this._currentMillis = this._startMillis;
    this._isStarted = false;
  }

  // Getters

  public get millis() {
    return this._currentMillis;
  }

  public get minutes(): number {
    return Math.floor(this._currentMillis / 60000);
  }

  public get seconds(): number {
    return Math.floor((this._currentMillis - this.minutes * 60000) / 1000);
  }

  public get isStarted(): boolean {
    return this._isStarted;
  }

  public set millis(millis: number) {
    this._currentMillis = millis;
  }

  //   public set currentMillis(millis: number) {
  //     this.currentMillis = millis;
  //   }

  // Utilities

  public toString() {
    let minutes = (this.minutes < 10 ? "0" : "") + this.minutes;
    let seconds = (this.seconds < 10 ? "0" : "") + this.seconds;
    return minutes + ":" + seconds;
  }
}
