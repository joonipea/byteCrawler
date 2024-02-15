import React, { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../appContext";

const JukeBox = () => {
    const [context, setContext] = useContext(AppContext);
    const contextCopy = useRef();
    contextCopy.current = context;
    let ctx = new AudioContext();
    const [audio, setAudio] = useState(null);
    const [audioBufferSourceNode, setAudioBufferSourceNode] = useState(null);
    const [gainNode, setGainNode] = useState(null);
    useEffect(() => {}, [context.volume]);

    function preFetchAudio() {
        const urls = [
            "./music/map.ogg",
            "./music/map.wav",
            "./music/FIGHT_REPRISE.ogg",
            "./music/FIGHT_REPRISE.wav",
            "./music/GAME OVER.wav",
            "./music/DEAD.wav",
        ];
        const opts = {
            "Cache-Control": "private, max-age=2592000, force-cache",
        };
        urls.forEach((url) => {
            fetch(url, {
                headers: opts,
            });
        });
    }

    useEffect(() => {
        if (!context.url) {
            preFetchAudio();
            return;
        }

        async function getBuffer() {
            const data = await fetch(contextCopy.current.url);
            const arrayBuffer = await data.arrayBuffer();
            const decodedAudio = await ctx.decodeAudioData(arrayBuffer);
            setAudio(decodedAudio);
        }

        getBuffer().catch(console.error);
    }, [context.url]);

    useEffect(() => {
        if (audio === null) return;
        const volume = context.volume >= 0 ? context.volume / 100 : 1;
        const playSound = ctx.createBufferSource();
        playSound.buffer = audio;
        playSound.loop = true;
        const gain = ctx.createGain();
        gain.gain.value = volume;
        playSound.connect(gain);
        gain.connect(ctx.destination);
        setGainNode(gain);
        setAudioBufferSourceNode(playSound);
    }, [audio]);

    useEffect(() => {
        if (audioBufferSourceNode === null) return;
        audioBufferSourceNode.start();
        return () => {
            audioBufferSourceNode.stop();
        };
    }, [audioBufferSourceNode]);

    useEffect(() => {
        if (audioBufferSourceNode === null) return;
        const volume = context.volume >= 0 ? context.volume / 100 : 1;
        gainNode.gain.value = volume;
    }, [context.volume]);

    useEffect(() => {
        if (context.stopMusic) {
            audioBufferSourceNode.stop();
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    stopMusic: false,
                };
            });
        }
    }, [context.stopMusic]);
};

export default JukeBox;
