/**
 * Slide to Accept Web Component
 * 
 * Usage:
 * <script src="slide-to-accept.js"></script>
 * <slide-to-accept text="Slide to confirm" width="350"></slide-to-accept>
 * 
 * Attributes:
 * - text: Text displayed in slider (default: "Slide to Accept")
 * - success-text: Success message (default: "✅ Accepteret!")
 * - width: Width in pixels (default: "300")
 * - height: Height in pixels (default: "60")
 * - track-color: Color of the track (default: "#4CAF50")
 * - handle-color: Color of the handle (default: "white")
 * - threshold: Percentage to slide for acceptance (default: "0.8")
 * 
 * Events:
 * - accepted: Fired when slider is completed
 * - reset: Fired when slider is reset
 * 
 * Methods:
 * - isCompleted(): Returns boolean
 * - programmaticComplete(): Complete programmatically
 * - programmaticReset(): Reset programmatically
 */
class SlideToAcceptElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.maxDistance = 0;
        this.threshold = 0;
    }

    static get observedAttributes() {
        return ['text', 'success-text', 'width', 'height', 'track-color', 'handle-color', 'threshold'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    attributeChangedCallback() {
        if (this.shadowRoot) {
            this.render();
            this.setupEventListeners();
        }
    }

    get text() {
        return this.getAttribute('text') || 'Slide to Accept';
    }

    get successText() {
        return this.getAttribute('success-text') || '✅ Accepteret!';
    }

    get width() {
        return this.getAttribute('width') || '300';
    }

    get height() {
        return this.getAttribute('height') || '60';
    }

    get trackColor() {
        return this.getAttribute('track-color') || '#4CAF50';
    }

    get handleColor() {
        return this.getAttribute('handle-color') || 'white';
    }

    get thresholdPercent() {
        return parseFloat(this.getAttribute('threshold')) || 0.8;
    } render() {
        const handleSize = parseInt(this.height) - 10;
        const borderRadius = parseInt(this.height) / 2;
        const widthValue = this.width.includes('%') ? this.width : `${this.width}px`;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .slide-container {
                    position: relative;
                    width: ${widthValue};
                    height: ${this.height}px;
                    background: #e0e0e0;
                    border-radius: ${borderRadius}px;
                    overflow: hidden;
                    box-shadow: inset 0 2px 6px rgba(0,0,0,0.2);
                    user-select: none;
                    touch-action: pan-y;
                }

                .slide-track {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    width: ${handleSize}px;
                    height: ${handleSize}px;
                    background: linear-gradient(to right, ${this.trackColor}, ${this.trackColor}dd);
                    border-radius: ${handleSize / 2}px;
                    transition: width 0.05s ease;
                    z-index: 1;
                }

                .slide-handle {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    width: ${handleSize}px;
                    height: ${handleSize}px;
                    background: ${this.handleColor};
                    border-radius: 50%;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    cursor: grab;
                    transition: all 0.2s ease;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${Math.floor(handleSize * 0.4)}px;
                    color: #666;
                }

                .slide-handle:active {
                    cursor: grabbing;
                    transform: scale(1.1);
                }

                .slide-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #666;
                    font-weight: 500;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                    z-index: 5;
                    font-size: ${Math.floor(parseInt(this.height) * 0.25)}px;
                }

                .slide-container.completed .slide-track {
                    width: calc(100% - 5px);
                }

                .slide-container.completed .slide-text {
                    opacity: 0;
                }

                .slide-container.completed .slide-handle {
                    left: calc(100% - ${handleSize + 5}px);
                    background: ${this.trackColor};
                    color: white;
                }

                .success-message {
                    margin-top: 15px;
                    padding: 10px 15px;
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                    border-radius: 6px;
                    text-align: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    font-size: ${Math.floor(parseInt(this.height) * 0.22)}px;
                }

                .success-message.show {
                    opacity: 1;
                }

                .reset-btn {
                    margin-top: 10px;
                    padding: 8px 16px;
                    background: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: ${Math.floor(parseInt(this.height) * 0.2)}px;
                    font-weight: 500;
                    transition: background-color 0.2s ease;
                }

                .reset-btn:hover {
                    background: #0056b3;
                }

                .reset-btn:active {
                    transform: translateY(1px);
                }
            </style>
            
            <div class="slide-container">
                <div class="slide-track"></div>
                <div class="slide-handle">→</div>
                <div class="slide-text">${this.text}</div>
            </div>
            <div class="success-message">${this.successText}</div>
            <button class="reset-btn">Reset</button>
        `;
    }

    setupEventListeners() {
        const container = this.shadowRoot.querySelector('.slide-container');
        const handle = this.shadowRoot.querySelector('.slide-handle');
        const resetBtn = this.shadowRoot.querySelector('.reset-btn'); if (!container || !handle || !resetBtn) return;

        this.container = container;
        this.handle = handle;
        this.successMessage = this.shadowRoot.querySelector('.success-message');

        // Calculate actual width - handle percentage widths properly
        const actualWidth = this.getActualWidth();
        this.maxDistance = actualWidth - parseInt(this.height) + 5;
        this.threshold = this.maxDistance * this.thresholdPercent;

        this.removeEventListeners();

        this.mouseDownHandler = this.onStart.bind(this);
        this.mouseMoveHandler = this.onMove.bind(this);
        this.mouseUpHandler = this.onEnd.bind(this);

        handle.addEventListener('mousedown', this.mouseDownHandler);
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);

        this.touchStartHandler = this.onStart.bind(this);
        this.touchMoveHandler = this.onMove.bind(this);
        this.touchEndHandler = this.onEnd.bind(this);

        handle.addEventListener('touchstart', this.touchStartHandler, { passive: true });
        document.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
        document.addEventListener('touchend', this.touchEndHandler);

        this.resetHandler = this.reset.bind(this);
        resetBtn.addEventListener('click', this.resetHandler);

        this.dragStartHandler = e => e.preventDefault();
        handle.addEventListener('dragstart', this.dragStartHandler);
    }

    removeEventListeners() {
        if (this.handle) {
            this.handle.removeEventListener('mousedown', this.mouseDownHandler);
            this.handle.removeEventListener('touchstart', this.touchStartHandler);
            this.handle.removeEventListener('dragstart', this.dragStartHandler);
        }

        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);
        document.removeEventListener('touchmove', this.touchMoveHandler);
        document.removeEventListener('touchend', this.touchEndHandler);

        const resetBtn = this.shadowRoot?.querySelector('.reset-btn');
        if (resetBtn && this.resetHandler) {
            resetBtn.removeEventListener('click', this.resetHandler);
        }
    } disconnectedCallback() {
        this.removeEventListeners();
    }

    recalculateDistances() {
        const actualWidth = this.getActualWidth();
        this.maxDistance = actualWidth - parseInt(this.height) + 5;
        this.threshold = this.maxDistance * this.thresholdPercent;
    }

    onStart(e) {
        if (this.container.classList.contains('completed')) return;

        // Recalculate distances in case the element was resized
        this.recalculateDistances();

        this.isDragging = true;
        this.startX = this.getClientX(e);
        this.handle.style.transition = 'none';
    }

    onMove(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        const clientX = this.getClientX(e);
        const deltaX = clientX - this.startX;

        this.currentX = Math.max(0, Math.min(deltaX, this.maxDistance));

        this.updateHandlePosition();
        this.updateTrackWidth();
    }

    onEnd(e) {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.handle.style.transition = 'all 0.2s ease';

        if (this.currentX >= this.threshold) {
            this.complete();
        } else {
            this.resetPosition();
        }
    }

    getClientX(e) {
        return e.type.includes('touch') ? e.touches[0]?.clientX || e.changedTouches[0]?.clientX : e.clientX;
    }

    updateHandlePosition() {
        this.handle.style.left = (5 + this.currentX) + 'px';
    }

    updateTrackWidth() {
        const handleSize = parseInt(this.height) - 10;
        const trackWidth = handleSize + this.currentX;
        this.shadowRoot.querySelector('.slide-track').style.width = trackWidth + 'px';
    }

    complete() {
        this.container.classList.add('completed');
        this.currentX = this.maxDistance;
        this.updateHandlePosition();
        this.updateTrackWidth();

        setTimeout(() => {
            this.successMessage.classList.add('show');
        }, 300);

        this.dispatchEvent(new CustomEvent('accepted', {
            detail: { timestamp: new Date() },
            bubbles: true
        }));
    }

    resetPosition() {
        this.currentX = 0;
        this.handle.style.left = '5px';
        const handleSize = parseInt(this.height) - 10;
        this.shadowRoot.querySelector('.slide-track').style.width = handleSize + 'px';
    }

    reset() {
        this.container.classList.remove('completed');
        this.successMessage.classList.remove('show');
        this.resetPosition();

        this.dispatchEvent(new CustomEvent('reset', {
            detail: { timestamp: new Date() }, bubbles: true
        }));
    }

    getActualWidth() {
        const widthAttr = this.getAttribute('width') || '300';

        // If width is a percentage or contains non-numeric characters
        if (widthAttr.includes('%') || isNaN(parseInt(widthAttr))) {
            // Wait for the element to be rendered, then get the actual computed width
            // Use the slide-container element which has the actual rendered width
            if (this.container) {
                const containerRect = this.container.getBoundingClientRect();
                if (containerRect.width > 0) {
                    return containerRect.width;
                }
            }

            // Fallback: try to get width from the host element
            const hostRect = this.getBoundingClientRect();
            if (hostRect.width > 0) {
                return hostRect.width;
            }

            // Final fallback to default width
            return 300;
        }

        // Otherwise use the numeric width attribute
        return parseInt(widthAttr);
    }

    isCompleted() {
        return this.container?.classList.contains('completed') || false;
    }

    programmaticComplete() {
        this.complete();
    }

    programmaticReset() {
        this.reset();
    }
}

if (!customElements.get('slide-to-accept')) {
    customElements.define('slide-to-accept', SlideToAcceptElement);
}