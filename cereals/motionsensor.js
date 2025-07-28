(function () {
    let CameraMovement = {
        callback: null,
        freq: 0,
        timeNow: 0,
        video: null,
        canvas: null,
        ctx: null,
        previewEnabled: false,
        isCanvasAdded: false,
        previousFrame: null,
        threshold: 200, 

        start(freq = 200, cameraId = 0) {
            this.freq = freq;
            this.timeNow = Date.now();
            this.video = document.createElement('video');
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');

            // Carica OFlow dinamicamente
            this.loadOFlow().then(() => {
                const flow = new oflow.WebCamFlow(this.video, 48);
                flow.startCapture(cameraId);

                flow.onCalculated((direction) => {
                    const angle = Math.atan2(direction.v, direction.u) * (180 / Math.PI);

                    // Calcola il magnitude basato sui pixel che cambiano
                    const magnitude = this.calculateMagnitude();

                    if (magnitude > 0 && (Date.now() - this.timeNow) > this.freq) {
                        if (this.callback) {
                            this.callback({
                                direction: Math.round(angle * 1e2) / 1e2,
                                magnitude: Math.round(magnitude * 1e2) / 1e2
                            });
                        }
                        this.timeNow = Date.now();
                    }

                    // Mostra l'anteprima, se abilitata
                    if (this.previewEnabled) {
                        this.showPreview();
                    }
                });
            });
        },

        calculateMagnitude() {
            if (this.video.readyState !== this.video.HAVE_ENOUGH_DATA) {
                return 0;
            }

            // Disegna il fotogramma attuale
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            const currentFrame = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

            // Se non c'è un fotogramma precedente, inizializza e ritorna 0
            if (!this.previousFrame) {
                this.previousFrame = currentFrame;
                return 0;
            }

            let diffCount = 0;

            // Confronta il fotogramma attuale con quello precedente
            for (let i = 0; i < currentFrame.data.length; i += 4) {
                const diffR = Math.abs(currentFrame.data[i] - this.previousFrame.data[i]);
                const diffG = Math.abs(currentFrame.data[i + 1] - this.previousFrame.data[i + 1]);
                const diffB = Math.abs(currentFrame.data[i + 2] - this.previousFrame.data[i + 2]);
                const diff = diffR + diffG + diffB;

                if (diff > this.threshold) {
                    diffCount++;
                }
            }

            // Aggiorna il fotogramma precedente
            this.previousFrame = currentFrame;

            return diffCount;
        },

        loadOFlow() {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = "https://app.protobject.com/pcode/js/utils/oflow.js";
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load OFlow'));
                document.head.appendChild(script);
            });
        },

        onData(callback) {
            this.callback = callback;
        },

        setThreshold(value) {
            if (typeof value === 'number' && value > 0) {
                this.threshold = value;
            } else {
                console.warn("Invalid threshold value. It must be a positive number.");
            }
        },

        showPreview({ top = 0, left = 0, width = 640, height = 480 } = {}) {
            this.previewEnabled = true;

            if (!this.isCanvasAdded) {
                this.canvas.style.position = 'absolute';
                this.canvas.style.top = `${top}px`;
                this.canvas.style.left = `${left}px`;
                this.canvas.style.width = `${width}px`;
                this.canvas.style.height = `${height}px`;
                document.body.appendChild(this.canvas);
                this.isCanvasAdded = true;
            } else {
                this.canvas.style.display = 'block';
            }

            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        },

        hidePreview() {
            this.previewEnabled = false;
            if (this.isCanvasAdded) {
                this.canvas.style.display = 'none';
            }
        },

        stop() {
            if (this.video && this.video.srcObject) {
                const tracks = this.video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
            this.video = null;
            this.canvas = null;
            this.ctx = null;
            this.previousFrame = null;
        }
    };

    if (typeof Protobject !== 'undefined') {
        Protobject.CameraMovement = CameraMovement;
    } else {
        console.warn('Protobject is not defined. CameraMovement was not added.');
    }
})(this);
