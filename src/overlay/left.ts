import { useZutContext } from "../index";
import { css } from "@emotion/css";
import { getStackList } from "./stacklist";

export function getLeftPanel() {
	const leftPanelClass = css`
    display: flex;
    flex-direction: column;
    width: 40%;
  `;

	const leftPanel = document.createElement("div");
	leftPanel.className = leftPanelClass;

	leftPanel.appendChild(getSubtitle());
	leftPanel.appendChild(getTitle());
	leftPanel.appendChild(getSeparator());
	leftPanel.appendChild(getStackList());

	return leftPanel;
}

function getSubtitle() {
	const theme = useZutContext().theme;
	const error = useZutContext().error;

	const subtitleClass = css`
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
    
    color: ${theme.accentColor};
  `;

	const subtitle = document.createElement("h2");
	subtitle.className = subtitleClass;
	if (error instanceof Error) subtitle.innerText = error.name;
	else subtitle.innerText = "Throw";

	return subtitle;
}

function getTitle() {
	const error = useZutContext().error;
	const unknowTranslation = useZutContext().options.unknownTranslation ?? "";

	const titleClass = css`
    font-size: 2.375rem;
    font-weight: 300;
    margin: 1rem 0 0 0;
  `;

	const title = document.createElement("h1");
	title.className = titleClass;

	if (error instanceof Error) title.innerText = error.message;
	else if (typeof error === "string") title.innerText = error;
	else if (typeof error === "number") title.innerText = String(error);
	else title.innerText = unknowTranslation;

	return title;
}

function getSeparator() {
	const theme = useZutContext().theme;

	const separatorClass = css`
    display: block;
    height: 2px;
    border: 0;
    background: ${theme.activeBackground};
    margin: 1rem 1%;
    width: 98%;
  `;

	const separator = document.createElement("hr");
	separator.className = separatorClass;

	return separator;
}
