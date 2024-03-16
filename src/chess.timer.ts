class CountdownTimer {
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

export class ChessTimer {
  // Fields

  private _playerTimerA: CountdownTimer;
  private _playerTimerB: CountdownTimer;

  // Constructor

  constructor(startA: number, startB: number) {
    this._playerTimerA = new CountdownTimer(startA);
    this._playerTimerB = new CountdownTimer(startB);
  }

  // Methods

  start() {
    this._playerTimerA.start();
  }

  switch() {
    if (this._playerTimerA.isStarted) {
      this._playerTimerA.pause();
      this._playerTimerB.start();
    } else {
      this._playerTimerA.start();
      this._playerTimerB.pause();
    }
  }

  pause() {
    this._playerTimerA.pause();
    this._playerTimerB.pause();
  }

  stop() {
    this._playerTimerA.stop();
    this._playerTimerB.stop();
  }

  // Getters and setters

  public set millisA(millis: number) {
    this._playerTimerA.millis = millis;
  }

  public set millisB(millis: number) {
    this._playerTimerB.millis = millis;
  }

  public get millisA() {
    return this._playerTimerA.millis;
  }

  public get millisB() {
    return this._playerTimerB.millis;
  }

  public get isStarted() {
    return this._playerTimerA.isStarted || this._playerTimerB.isStarted;
  }

  timeA(): string {
    return this._playerTimerA.toString();
  }

  timeB(): string {
    return this._playerTimerB.toString();
  }

  // Utilities
}
