import { AnimationAction, Scene } from 'three/src/Three.js';
// import { getIntersects } from './rayCastUtils.js';
import { DuckStates } from './enums/DuckStates.js';
import Duck from './Duck';
import { GUI } from 'lil-gui';
import * as THREE from 'three';

export default class AnimationController {
    scene: Scene;
    wait = false;
    animationActions: { [key: string]: AnimationAction } = {};
    activeAction?: AnimationAction;
    nextAction?: DuckStates;
    speed = 0;
    model?: Duck;
    gui?: GUI;

    private duckStateIndex = 0;
    private duckStates = [
        'idle',
        'idleToLay',
        'lay',
        'layToIdle',
        'eat',
        'run',
        'runLeft',
        'runRight',
        'walk',
        'walkLeft',
        'walkRight',
    ];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    async init() {
        this.model = new Duck();
        this.activeAction = this.animationActions['lay'];
        await this.model.init(this.animationActions);
        this.scene.add(this.model);

        this.nextAction = DuckStates.IDLE;
        this.gui = new GUI();
        const duckStates = this.gui.addFolder('Duck States');
        duckStates.add(this, 'nextAction', {
            idle: DuckStates.IDLE,
            eat: DuckStates.EAT,
            lay: DuckStates.LAY,
        });
    }

    setAction(action: AnimationAction) {
        if (this.activeAction !== action) {
            this.activeAction?.fadeOut(1);
            action.reset().fadeIn(1).play();
            this.activeAction = action;
        }
    }

    update(delta: number) {
        if (!this.wait) {
            let actionAssigned = false;

            if (!actionAssigned && this.nextAction == DuckStates.LAY) {
                const idleToLayAction = this.animationActions['idleToLay'];
                const layAction = this.animationActions['lay'];

                switch (this.activeAction) {
                    case this.animationActions['idle']:
                        if (idleToLayAction && layAction) {
                            this.wait = true; // Block further transitions immediately
                            this.activeAction?.fadeOut(1);
                            idleToLayAction.reset();
                            idleToLayAction.setLoop(THREE.LoopOnce, 1);
                            idleToLayAction.clampWhenFinished = true;
                            idleToLayAction.fadeIn(1).play();
                            this.activeAction = idleToLayAction;
                            actionAssigned = true;

                            // When idleToLay finishes, play lay (looping)
                            const onIdleToLayFinished = () => {
                                idleToLayAction
                                    .getMixer()
                                    .removeEventListener('finished', onIdleToLayFinished);
                                layAction.reset();
                                layAction.setLoop(THREE.LoopRepeat, Infinity);
                                layAction.clampWhenFinished = false;
                                layAction.fadeIn(1).play();
                                this.activeAction = layAction;
                                this.wait = false;
                            };
                            idleToLayAction
                                .getMixer()
                                .addEventListener('finished', onIdleToLayFinished);
                        }
                        break;
                    default:
                        if (this.activeAction !== layAction) {
                            this.setAction(layAction);
                            actionAssigned = true;
                        }
                }
            }

            if (!actionAssigned && this.nextAction == DuckStates.IDLE) {
                const layToIdleAction = this.animationActions['layToIdle'];
                const idleAction = this.animationActions['idle'];

                switch (this.activeAction) {
                    case this.animationActions['lay']:
                        if (layToIdleAction && idleAction) {
                            this.wait = true;
                            this.activeAction?.fadeOut(1);
                            layToIdleAction.reset();
                            layToIdleAction.setLoop(THREE.LoopOnce, 1);
                            layToIdleAction.clampWhenFinished = true;
                            layToIdleAction.fadeIn(1).play();
                            this.activeAction = layToIdleAction;
                            actionAssigned = true;

                            const onLayToIdleActionFinished = () => {
                                layToIdleAction
                                    .getMixer()
                                    .removeEventListener('finished', onLayToIdleActionFinished);
                                idleAction.reset();
                                idleAction.setLoop(THREE.LoopRepeat, Infinity);
                                idleAction.clampWhenFinished = false;
                                idleAction.fadeIn(1).play();
                                this.activeAction = idleAction;
                                this.wait = false;
                            };

                            layToIdleAction
                                .getMixer()
                                .addEventListener('finished', onLayToIdleActionFinished);
                        }
                        break;
                    default:
                        if (this.activeAction !== idleAction) {
                            this.setAction(idleAction);
                            actionAssigned = true;
                        }
                }
            }

            if (!actionAssigned && this.nextAction == DuckStates.EAT) {
                const eatAction = this.animationActions['eat'];
                if (this.activeAction !== eatAction) {
                    this.setAction(eatAction);
                    actionAssigned = true;
                }
            }
        }

        // Always update the mixer
        this.model?.update(delta);
    }

    // handleClick(event: MouseEvent, container: HTMLDivElement, camera: THREE.Camera) {
    //     if (!this.model || this.wait) {
    //         return;
    //     }
    //     const intersects = getIntersects(event, container, camera, this.model.children);
    //     if (intersects.length > 0) {
    //         const state = this.duckStates[this.duckStateIndex];
    //         const action = this.animationActions[state];
    //         if (action) {
    //             this.setAction(action);

    //             //Only wait for non-looping actions
    //             action.clampWhenFinished = true;
    //             action.setLoop(THREE.LoopOnce, 1);

    //             this.wait = true;
    //             action.getMixer().addEventListener('finished', () => {
    //                 this.wait = false;
    //             });
    //         }
    //         this.duckStateIndex = (this.duckStateIndex + 1) % this.duckStates.length;
    //     }
    // }
}
