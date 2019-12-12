import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/GLTFLoader.js';

const rad = 2 * 3.14

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = 20;
    const aspect = 2; // the canvas default
    const near = 10;
    const far = 500;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 60, 150);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');

    {
        const planeSize = 40;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('./ground.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 10;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);
    }

    {
        const skyColor = 0xB1E1FF; // light blue
        const groundColor = 0xB97A20; // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }

    {
        var moonTexture = new THREE.TextureLoader().load("./moon.jpg");
        var geometry = new THREE.SphereGeometry(5, 15, 15);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        var sphere = new THREE.Mesh(geometry, material);
        material.map = moonTexture;
        sphere.position.set(5, 25, -20)
        scene.add(sphere);
    }
    // Moon
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 0, 40);
        light.target.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
        scene.add(light);
        scene.add(light.target);
    }
    // Moonlight
    {
        const color = 0x7777FF;
        const intensity = 0.7;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
        light.target.position.set(0, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }

    function dumpObject(obj, lines = [], isLast = true, prefix = '') {
        const localPrefix = isLast ? 'â””â”€' : 'â”œâ”€';
        lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
        const newPrefix = prefix + (isLast ? '  ' : 'â”‚ ');
        const lastNdx = obj.children.length - 1;
        obj.children.forEach((child, ndx) => {
            const isLast = ndx === lastNdx;
            dumpObject(child, lines, isLast, newPrefix);
        });
        return lines;
    }
    let
        tortodile, head, neck, jaw,
        spine, hips,
        lthig, rthig,
        lfoot, rfoot,
        tail,
        larm, rarm, lhand, rhand,
        rforearm, lforearm; {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
            './totodile/scene.gltf', (gltf) => {
                const root = gltf.scene;
                tortodile = root;
                scene.add(root);
                console.log(dumpObject(root).join('\n'));

                root.scale.set(0.2, 0.2, 0.2)

                // Head
                head = root.getObjectByName('Head_027')

                // Mandibula
                jaw = root.getObjectByName('Jaw_029')

                // Pescoco
                neck = root.getObjectByName('Neck_026')

                // Espinha
                spine = root.getObjectByName('Spine_021')

                // Quadril
                hips = root.getObjectByName('Hips_04')

                // Pes
                lfoot = root.getObjectByName('LFoot_08')
                rfoot = root.getObjectByName('RFoot_014')

                //Coxas
                lthig = root.getObjectByName('LThigh_06')
                rthig = root.getObjectByName('RThigh_012')

                // cauda
                tail = root.getObjectByName('Tail1_018')

                //arma
                larm = root.getObjectByName('LArm_023')
                rarm = root.getObjectByName('RArm_032')

                // Antebracos
                lforearm = root.getObjectByName('LForeArm_024')
                rforearm = root.getObjectByName('LForeArm_024')

                // Maos
                lhand = root.getObjectByName('LHand_00')
                rhand = root.getObjectByName('RHand_034')


                lhand.rotation.x = rad * -0.2
                jaw.rotation.y = (rad / 1.3)

            });
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    {
        var count_goodbye = 0

        var sense_spine = 1,
            sense_larm = 1,
            sense_lforearm = 1,
            sense_jaw = 1

        var rotation_spine = 0,
            rotation_larm = 0,
            rotation_lforearm = 0,
            rotation_jaw = 1.78
    }

    function goodByeAnimation(time) {
        time *= 0.001; // convert to seconds

        if (tortodile) {


            if (rotation_spine < 0 || rotation_spine > 0.08) {
                sense_spine = 0
            }

            rotation_spine += 0.002 * sense_spine
            spine.rotation.z = rad * rotation_spine

            if (rotation_larm < 0 || rotation_larm > 0.1)
                sense_larm *= 0

            rotation_larm += 0.004 * sense_larm
            larm.rotation.z = rad * rotation_larm

            if (rotation_lforearm < 0 || rotation_lforearm > 0.2) {
                count_goodbye += 1
                sense_lforearm *= -1
            }

            // console.log(sense_lforearm)

            rotation_lforearm += 0.009 * sense_lforearm
            lforearm.rotation.z = rad * rotation_lforearm

        }
    }


    function breathingAnimation(time) {
        time *= 0.001; // convert to seconds

        if (tortodile) {
            lhand.rotation.x = rad
            larm.rotation.z = rad * 0.9
            rarm.rotation.z = rad * 0.1

            if (rotation_spine < 0 || rotation_spine > 0.08) {
                sense_spine *= -1
            }

            rotation_spine += 0.002 * sense_spine
            spine.rotation.y = rad * rotation_spine

            rotation_jaw += 0.001436 * sense_spine
            jaw.rotation.y = rad * rotation_jaw
        }
    }

    function render(time) {

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // goodByeAnimation(time)
        breathingAnimation(time)

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main()
