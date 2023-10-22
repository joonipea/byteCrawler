import React, { useContext, useEffect } from "react";
import { AppContext } from "../appContext";
const CreditsScreen = () => {
    const [context, setContext] = useContext(AppContext);
    useEffect(() => {
        setTimeout(() => {
            setContext({ ...context, screen: "start" });
        }, 30000);
    }, [context]);
    return (
        <div className="credits-container">
            <div className="title-container">Credits</div>
            <div className="credit-holder">
                <div className="credit-title">Developer</div>
                <div className="creditor">
                    <div className="creditor-name">June Pratt</div>
                    <div className="creditor-links">
                        <a
                            href="https://joonipea.com/"
                            target="_blank"
                            title="Website">
                            <p>Website</p>
                        </a>
                        <a
                            href="https://github.com/joonipea/"
                            target="_blank"
                            title="GitHub">
                            <p>GitHub</p>
                        </a>
                    </div>
                </div>
            </div>
            <div className="credit-holder">
                <div className="credit-title">Art</div>
                <div className="creditor">
                    <div className="creditor-name">Mrmo Tarius</div>
                    <div className="credit-subtitle">
                        Actor, Item, & Map sprites
                    </div>
                    <div className="creditor-links">
                        <a
                            href="https://twitter.com/mrmotarius"
                            target="_blank"
                            title="Twitter">
                            <p>Twitter</p>
                        </a>
                        <a
                            href="https://ko-fi.com/mrmotarius"
                            target="_blank"
                            title="Ko-fi">
                            <p>Ko-fi</p>
                        </a>
                        <a
                            href="https://mrmotarius.itch.io/moregoblins"
                            target="_blank"
                            title="Itch.io">
                            <p>Itch.io</p>
                        </a>
                    </div>
                </div>
                <div className="creditor">
                    <div className="creditor-name">Alec Lownes</div>
                    <div className="credit-subtitle">CRT Effect</div>
                    <div className="creditor-links">
                        <a
                            href="http://aleclownes.com/2017/02/01/crt-display.html"
                            target="_blank"
                            title="Source">
                            <p>Source</p>
                        </a>
                    </div>
                </div>
                <div className="creditor">
                    <div className="creditor-name">June Pratt</div>
                    <div className="credit-subtitle">Item sprites</div>
                </div>
            </div>
            <div className="credit-holder">
                <div className="credit-title">Music</div>
                <div className="creditor">
                    <div className="creditor-name">Joonipea</div>
                    <div className="creditor-links">
                        <a
                            href="https://joonipea.com/"
                            target="_blank"
                            title="Website">
                            <p>Website</p>
                        </a>
                        <a
                            href="https://soundcloud.com/joonipea/sets/bytecrawler-ost"
                            target="_blank"
                            title="SoundCloud">
                            <p>OST</p>
                        </a>
                    </div>
                </div>
            </div>
            <div className="credit-holder">
                <div className="credit-title">Special Thanks</div>
                <div className="creditor">
                    <div className="creditor-name">Mr. Glenn</div>
                </div>
                <div className="creditor">
                    <div className="creditor-name">QJ</div>
                </div>
                <div className="creditor">
                    <div className="creditor-name">Duane</div>
                </div>
                <div className="creditor">
                    <div className="creditor-name">Ruby</div>
                </div>
                <div className="creditor">
                    <div className="creditor-name">You</div>
                </div>
            </div>
            <div className="credit-holder">
                <div className="player-sprite"></div>
                <div className="credit-title">Thanks for playing!</div>
            </div>
        </div>
    );
};

export default CreditsScreen;
