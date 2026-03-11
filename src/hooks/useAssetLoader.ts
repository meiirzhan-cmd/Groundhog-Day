import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";

interface AssetManifest {
  models?: string[];
  textures?: string[];
}

interface LoadedAssets {
  models: Map<string, GLTF>;
  textures: Map<string, THREE.Texture>;
}

/**
 * Preloads GLB models and textures, returning loading state and assets.
 */
export function useAssetLoader(manifest: AssetManifest) {
  const [assets, setAssets] = useState<LoadedAssets>({
    models: new Map(),
    textures: new Map(),
  });
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    const modelPaths = manifest.models ?? [];
    const texturePaths = manifest.textures ?? [];
    const total = modelPaths.length + texturePaths.length;

    if (total === 0) {
      setIsLoaded(true);
      setProgress(1);
      return;
    }

    let loaded = 0;
    const models = new Map<string, GLTF>();
    const textures = new Map<string, THREE.Texture>();

    const tick = () => {
      loaded++;
      if (!cancelled) {
        setProgress(loaded / total);
      }
    };

    const promises: Promise<void>[] = [
      ...modelPaths.map((path) =>
        new Promise<void>((resolve) => {
          gltfLoader.load(path, (gltf) => {
            models.set(path, gltf);
            tick();
            resolve();
          });
        }),
      ),
      ...texturePaths.map((path) =>
        new Promise<void>((resolve) => {
          textureLoader.load(path, (texture) => {
            textures.set(path, texture);
            tick();
            resolve();
          });
        }),
      ),
    ];

    Promise.all(promises).then(() => {
      if (!cancelled) {
        setAssets({ models, textures });
        setIsLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [manifest]);

  return { assets, progress, isLoaded };
}
