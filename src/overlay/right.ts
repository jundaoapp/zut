import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { useZutContext } from "../index";
import { css } from "@emotion/css";
import {
	getFileExtension,
	getFileName,
	isNodeModule,
} from "../stacktrace/utils";

export function getRightPanel() {
	const theme = useZutContext().theme;
	const stackframes = useZutContext().stackframes;

	const rightPanelClass = css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-left: 2rem;
    overflow: auto;
  `;

	const rightPanel = document.createElement("div");
	rightPanel.className = rightPanelClass;

	if (useZutContext().stackframes.length === 0) {
		const noStackframeClass = css`
      display: flex;
      gap: 1rem;
      padding: .5rem;
      align-items: center;
      justify-content: center;
    `;

		const noframes = document.createElement("div");
		noframes.className = noStackframeClass;
		noframes.innerText = useZutContext().options.noStacktraceTranslation ?? "";

		rightPanel.appendChild(noframes);
	} else {
		const codePreviewFilenameClass = css`
      background: ${theme.hoverBackground};
      border-bottom: 1px solid ${theme.activeBackground};
      margin: 1rem 1rem 0 0;
      padding: .5rem 1rem;
      flex-shrink: 0;
    `;

		const codePreviewFilename = document.createElement("div");
		codePreviewFilename.className = codePreviewFilenameClass;

		rightPanel.appendChild(codePreviewFilename);

		rightPanel.appendChild(getCodePreview());

		const codePreviewLineNumberClass = css`
      background: ${theme.hoverBackground};
      padding-top: .5rem;
      border-top: 1px solid ${theme.activeBackground};
      margin: 0 1rem 0 0;
      padding: .5rem 1rem;
    `;

		const codePreviewLineNumber = document.createElement("div");
		codePreviewLineNumber.className = codePreviewLineNumberClass;

		rightPanel.appendChild(codePreviewLineNumber);

		for (let i = 0; i < stackframes.length; i++) {
			const frame = stackframes[i];
			if (!isNodeModule(frame.getFileName())) {
				codePreviewFilename.innerText =
					getFileName(stackframes[i].getSource()) ?? "";
				codePreviewLineNumber.innerText = `${stackframes[
					i
				].getLineNumber()}:${stackframes[i].getColumnNumber()}`;
				break;
			}
		}

		// @ts-ignore: TS doesn't work with custom event
		document.addEventListener(
			"zut:change-current-frame",
			({ detail }: CustomEvent<{ index: number }>) => {
				codePreviewFilename.innerText =
					getFileName(stackframes[detail.index].getSource()) ?? "";
				codePreviewLineNumber.innerText = `${stackframes[
					detail.index
				].getLineNumber()}:${stackframes[detail.index].getColumnNumber()}`;
			},
		);
	}

	return rightPanel;
}

function getCodePreview() {
	const theme = useZutContext().theme;
	const stackframes = useZutContext().stackframes;
	const maxHighlightLenght = useZutContext().options.maxHighlightLenght ?? 0;
	const presetExtensions = useZutContext().options.presetExtension ?? {};

	const codePreviewClass = css`
    background: ${theme.hoverBackground};
    height: 100%;
    margin: 0 1rem 0 0;
    padding: 1rem 1rem 1rem 0;
    display: flex;
    flex-direction: row;
    overflow: auto;
  `;

	const codePreview = document.createElement("pre");
	codePreview.className = codePreviewClass;

	const codeHighlightedLineClass = css`
    background: ${theme.highlightedBackground};
  `;

	async function hightlight(frameIndex: number) {
		codePreview.innerHTML = "";

		const codePreviewLineNumberClass = css`
      font-family: ${theme.monoFont};
      opacity: ${theme.mutedOpacity};
      text-align: right;
      white-space: pre;
      margin: 0 .75rem;
      user-select: none;
      
      span {
        padding: 0 .75rem;
        margin: 0 -.75rem;
      }
    `;

		const codePreviewLineNumber = document.createElement("div");
		codePreviewLineNumber.className = codePreviewLineNumberClass;

		const codePreviewHtmlClass = css`
      font-family: ${theme.monoFont};
      height: max-content;
    `;

		const codePreviewHtml = document.createElement("code");
		codePreviewHtml.className = codePreviewHtmlClass;
		const sourceCode = stackframes[frameIndex].getSourceContent();
		const hljsAuto =
			sourceCode.length < maxHighlightLenght
				? getFileExtension(stackframes[frameIndex].getSource()) in
				  presetExtensions
					? hljs.highlight(
							presetExtensions[
								getFileExtension(stackframes[frameIndex].getSource())
							],
							sourceCode,
					  )
					: hljs.highlightAuto(sourceCode)
				: undefined;
		const highlightedCode = hljsAuto ? hljsAuto.value : sourceCode;

		console.log(hljsAuto);

		const splitHighlightedCode = highlightedCode.split("\n");

		for (let i = 0; i < splitHighlightedCode.length; i++) {
			if (stackframes[frameIndex].getLineNumber() === i + 1) {
				codePreviewLineNumber.innerHTML += `<span class="${codeHighlightedLineClass}">${String(
					i + 1,
				)}</span>\n`;
				codePreviewHtml.innerHTML += `<span class="${codeHighlightedLineClass}">${splitHighlightedCode[i]}</span>\n`;
			} else {
				codePreviewLineNumber.innerHTML += String(i + 1) + "\n";
				codePreviewHtml.innerHTML += splitHighlightedCode[i] + "\n";
			}
		}

		codePreview.appendChild(codePreviewLineNumber);
		codePreview.appendChild(codePreviewHtml);

		document
			.querySelector(`.${codeHighlightedLineClass}`)
			?.scrollIntoView({ block: "center" });
	}

	for (let i = 0; i < stackframes.length; i++) {
		const frame = stackframes[i];
		if (!isNodeModule(frame.getFileName())) {
			hightlight(i);
			break;
		}
	}

	// @ts-ignore: TS doesn't work with custom event
	document.addEventListener(
		"zut:change-current-frame",
		({ detail }: CustomEvent<{ index: number }>) => {
			hightlight(detail.index);
		},
	);

	return codePreview;
}
