import CountdownTimer from "./countdown.timer";

export default class ChessTimer {
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
    if (!this.isStarted) this._playerTimerA.millis = millis;
  }

  public set millisB(millis: number) {
    if (!this.isStarted) this._playerTimerB.millis = millis;
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
