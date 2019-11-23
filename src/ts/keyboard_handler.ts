// mmorpgのoguniコードからパクってきました.....
// MDNのcode値一覧をテキスト処理したもの
// tslint:disable-next-line: max-line-length
export type KeyCode = '' | 'Again' | 'AltLeft' | 'AltRight' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'AudioVolumeDown' | 'AudioVolumeMute' | 'AudioVolumeUp' | 'Backquote' | 'Backslash' | 'Backspace' | 'BracketLeft' | 'BracketRight' | 'BrowserBack' | 'BrowserFavorites' | 'BrowserForward' | 'BrowserHome' | 'BrowserRefresh' | 'BrowserSearch' | 'BrowserStop' | 'BrowserStopCancel' | 'CapsLock' | 'Comma' | 'ContextMenu' | 'ControlLeft' | 'ControlRight' | 'Convert' | 'Copy' | 'Cut' | 'Delete' | 'Digit0' | 'Digit1' | 'Digit2' | 'Digit3' | 'Digit4' | 'Digit5' | 'Digit6' | 'Digit7' | 'Digit8' | 'Digit9' | 'Eject' | 'End' | 'Enter' | 'Equal' | 'Escape' | 'F1' | 'F10' | 'F11' | 'F12' | 'F13' | 'F14' | 'F15' | 'F16' | 'F17' | 'F18' | 'F19' | 'F2' | 'F20' | 'F21' | 'F22' | 'F23' | 'F24' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'Find' | 'Fn' | 'Help' | 'HelpInsert' | 'Home' | 'Insert' | 'IntlBackslash' | 'IntlRo' | 'IntlYen' | 'KanaMode' | 'KeyA' | 'KeyB' | 'KeyC' | 'KeyD' | 'KeyE' | 'KeyF' | 'KeyG' | 'KeyH' | 'KeyI' | 'KeyJ' | 'KeyK' | 'KeyL' | 'KeyM' | 'KeyN' | 'KeyO' | 'KeyP' | 'KeyQ' | 'KeyR' | 'KeyS' | 'KeyT' | 'KeyU' | 'KeyV' | 'KeyW' | 'KeyX' | 'KeyY' | 'KeyZ' | 'Lang1' | 'HangulMode' | 'KanaMode' | 'Lang2' | 'LaunchApp1' | 'LaunchApp2' | 'LaunchMail' | 'LaunchMediaPlayer' | 'MediaPlayPause' | 'MediaSelect' | 'MediaStop' | 'MediaTrackNext' | 'MediaTrackPrevious' | 'MetaLeft' | 'MetaRight' | 'Minus' | 'NonConvert' | 'NumLock' | 'Numpad0' | 'Numpad1' | 'Numpad2' | 'Numpad3' | 'Numpad4' | 'Numpad5' | 'Numpad6' | 'Numpad7' | 'Numpad8' | 'Numpad9' | 'NumpadAdd' | 'NumpadComa' | 'NumpadComma' | 'NumpadDecimal' | 'NumpadDivide' | 'NumpadEnter' | 'NumpadEqual' | 'NumpadMultiply' | 'NumpadParenLeft' | 'NumpadParenRight' | 'NumpadSubtract' | 'OSLeft' | 'OSRight' | 'Open' | 'PageDown' | 'PageUp' | 'Paste' | 'Pause' | 'Period' | 'Power' | 'PrintScreen' | 'Props' | 'Quote' | 'RomanCharacters' | 'ScrollLock' | 'Select' | 'Semicolon' | 'ShiftLeft' | 'ShiftRight' | 'Slash' | 'Space' | 'Tab' | 'Undo' | 'Unidentified' | 'NumpadChangeSign' | 'Power' | 'VolumeDown' | 'VolumeMute' | 'VolumeUp' | 'WakeUp'

// キーが現在押されているかと、現在のフレームで押された/離されたかを取得するためのクラス。
export class KeyboardHandler {
    public readonly isKeyDown = new Map<KeyCode, boolean>()
    public readonly isKeyJustDown = new Map<KeyCode, boolean>()
    public readonly isKeyJustUp = new Map<KeyCode, boolean>()
    public readonly lastKeyDownTime = new Map<KeyCode, number>()

    private readonly eventBuffer: Array<{type: 'clear' | 'down' | 'up', code: KeyCode}> = []

    constructor() {
        window.addEventListener('blur', (e) => {
            this.eventBuffer.push({type: 'clear', code: ''})
        }, { passive: true })

        const isKeyDown = new Map<string, boolean>()
        window.addEventListener('keydown', (e) => {
            if ((e.code as string | undefined) !== undefined && !isKeyDown.get(e.code)) {
                isKeyDown.set(e.code, true)
                this.eventBuffer.push({type: 'down', code: e.code as KeyCode})
                e.stopImmediatePropagation()
            }
        }, true)

        window.addEventListener('keyup', (e) => {
            if ((e.code as string | undefined) !== undefined && isKeyDown.get(e.code)) {
                isKeyDown.set(e.code, false)
                this.eventBuffer.push({type: 'up', code: e.code as KeyCode})
                e.stopImmediatePropagation()
            }
        }, true)

        window.addEventListener('keypress', (e) => {
            e.stopImmediatePropagation()
        }, true)
    }

    public clear(): void {
        this.eventBuffer.length = 0
        this.isKeyDown.clear()
        this.isKeyJustDown.clear()
        this.isKeyJustUp.clear()
    }

    // 毎フレーム1回ずつ呼び出すこと。
    public update(): void {
        this.isKeyJustDown.clear()
        this.isKeyJustUp.clear()
        this.eventBuffer.forEach((e) => {
            switch (e.type) {
                case 'clear':
                    this.isKeyDown.clear()
                    break
                case 'down':
                    this.isKeyDown.set(e.code, true)
                    this.isKeyJustDown.set(e.code, true)
                    this.lastKeyDownTime.set(e.code, window.performance.now())
                    break
                case 'up':
                    this.isKeyDown.set(e.code, false)
                    this.isKeyJustUp.set(e.code, true)
                    break
                default:
                    const _: never = e.type
            }
        })
        this.eventBuffer.length = 0
    }
}
