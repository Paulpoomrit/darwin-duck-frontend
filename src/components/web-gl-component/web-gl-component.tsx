import styles from './web-gl-component.module.scss';
// import cx from 'classnames';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Game from './ThreeJSModules/Game.js';

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
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(1.5, 0.75, 2)
        const renderer = new THREE.WebGLRenderer( {antialias: true} );
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);


        const game = new Game(scene, camera, renderer);
        game.init();
        // container.addEventListener('click', (event) => {
        //     game.player?.animationController?.handleClick(event, container, camera);
        // });


        let animationId: number;
        const clock = new THREE.Clock();
        let delta = 0;

        function animate() {
            animationId =  requestAnimationFrame(animate);

            delta = clock.getDelta();

            controls.update();
            game.update(delta);

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
