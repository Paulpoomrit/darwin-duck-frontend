import styles from './web-gl-component.module.scss';
import cx from 'classnames';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export interface WebGLComponentProps {
    className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const WebGLComponent = ({ className }: WebGLComponentProps) => {
    const refContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const container = refContainer.current;
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 1.5;
        const renderer = new THREE.WebGLRenderer( {antialias: true} );
        renderer.setSize(container.clientWidth, container.clientHeight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        // controls.target.set(0, 1, 0);

        const environmentTexture = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
        scene.environment = environmentTexture
        scene.background = environmentTexture

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight)

        container.appendChild(renderer.domElement);

        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        let mixer: THREE.AnimationMixer;
        const animationActions: { [key: string]: THREE.AnimationAction } = {};

        const loadDarwinDuck = async () => {
            const loader = new GLTFLoader();
            const [duck, idle, idleToLay, lay, layToIdle, run,
                    runLeft, runRight, walk, walkLeft, walkRight
            ] = await Promise.all([
                loader.loadAsync('models/Duck_Anim_Eat.glb'),
                loader.loadAsync('models/Duck_Anim_Idle.glb'),
                loader.loadAsync('models/Duck_Anim_IdleToLay.glb'),
                loader.loadAsync('models/Duck_Anim_Lay.glb'),
                loader.loadAsync('models/Duck_Anim_LayToIdle.glb'),
                loader.loadAsync('public/models/Duck_Anim_Run.glb'),
                loader.loadAsync('public/models/Duck_Anim_RunLeft.glb'),
                loader.loadAsync('public/models/Duck_Anim_RunRight.glb'),
                loader.loadAsync('public/models/Duck_Anim_Walk.glb'),
                loader.loadAsync('public/models/Duck_Anim_WalkLeft.glb'),
                loader.loadAsync('public/models/Duck_Anim_WalkRight.glb')
            ]);
            mixer = new THREE.AnimationMixer(duck.scene);

            mixer = new THREE.AnimationMixer(duck.scene);

            animationActions['eat'] = mixer.clipAction(duck.animations[0]);
            animationActions['idle'] = mixer.clipAction(idle.animations[0]);
            animationActions['idleToLay'] = mixer.clipAction(idleToLay.animations[0]);
            animationActions['lay'] = mixer.clipAction(lay.animations[0]);
            animationActions['layToIdle'] = mixer.clipAction(layToIdle.animations[0]);
            animationActions['run'] = mixer.clipAction(run.animations[0]);
            animationActions['runLeft'] = mixer.clipAction(runLeft.animations[0]);
            animationActions['runRight'] = mixer.clipAction(runRight.animations[0]);
            animationActions['walk'] = mixer.clipAction(walk.animations[0]);
            animationActions['walkLeft'] = mixer.clipAction(walkLeft.animations[0]);
            animationActions['walkRight'] = mixer.clipAction(walkRight.animations[0]);

            animationActions['walk'].play();
            scene.add(duck.scene);
        };

        loadDarwinDuck();

        let animationId: number;
        const clock = new THREE.Clock();
        let delta = 0;

        function animate() {
            animationId =  requestAnimationFrame(animate);

            delta = clock.getDelta();

            if (mixer) {
                mixer.update(delta)
            }

            controls.update();



            renderer.render(scene, camera);
        }

        animate();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
            cancelAnimationFrame(animationId);
            renderer.dispose();
        };
    }, []);
    return (<div ref={refContainer} className={styles.webglcomponent}> </div>);
};
