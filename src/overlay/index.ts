import { useZutContext } from "../index";
import { css } from "@emotion/css";
import { getLeftPanel } from "./left";
import { getRightPanel } from "./right";
import {mutedHiddenClass} from "./stacklist";

export const overlayId = "zut-overlay";

const staticHtml = `
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=JetBrains+Mono:ital@0;1&display=swap" rel="stylesheet"> 
`;

export function getOverlay(): HTMLDivElement {
	return (
		(document.getElementById(overlayId) as HTMLDivElement) || createOverlay()
	);
}

function createOverlay(): HTMLDivElement {
	const theme = useZutContext().theme;

	const overlayBackdropClass = css`
    position: fixed;
    backdrop-filter: blur(2px);
    inset: 0;
  `;

	const backdrop = document.createElement("div");
	backdrop.className = overlayBackdropClass;
	backdrop.id = overlayId;
	backdrop.classList.add(mutedHiddenClass);

	const overlayClass = css`
    position: fixed;
    inset: min(2rem, 5vw);
    display: flex;
    align-items: stretch;
    background: ${theme.background};
    padding: min(4rem, 10vw);
    font-family: ${theme.sansFont};
    color: ${theme.textColor};
                  
    * {
      box-sizing: border-box;
    }
  `;

	const overlay = document.createElement("div");
	overlay.className = overlayClass;

	const staticHtmlNode = document.createElement("div");
	staticHtmlNode.innerHTML = staticHtml;
	overlay.appendChild(staticHtmlNode);

	overlay.appendChild(getLeftPanel());
	overlay.appendChild(getRightPanel());

	backdrop.appendChild(overlay);
	document.body.appendChild(backdrop);
	return backdrop;
}
