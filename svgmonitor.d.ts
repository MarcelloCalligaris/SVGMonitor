declare class SVGMonitor extends HTMLElement {
    private shadow;
    private _svgRootPromise;
    private _svgRoot;
    private _text;
    private _sleeper;
    constructor();
    static Initialize(): void;
    TypeAdd(message: string, newline?: boolean, delay?: number): Promise<void>;
    TypeBackspace(chars: number, delay?: number): Promise<void>;
    TypeOut(message: string, delay?: number): Promise<void>;
    get BSOD(): boolean;
    set BSOD(value: boolean);
    get ScanLines(): boolean;
    set ScanLines(value: boolean);
    get ScreenText(): string;
    set ScreenText(value: string);
}
