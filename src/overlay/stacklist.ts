import { css } from "@emotion/css";
import { useZutContext } from "../index";
import { StackFrame } from "../stacktrace";
import picomatch from "picomatch";

export let activeHasBeenSet = false;
export const mutedHiddenClass = "zut-muted-hidden";

export function getStackList() {
	const stackListClass = css`
    display: flex;
    flex-direction: column;
    overflow: auto;
  `;

	const stackList = document.createElement("div");
	stackList.className = stackListClass;

	if (useZutContext().stackframes === undefined) {
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

		stackList.appendChild(noframes);
	} else
		for (let i = 0; i < useZutContext().stackframes.length; i++) {
			stackList.appendChild(createFrame(useZutContext().stackframes[i], i));
		}

	return stackList;
}

function createFrame(stackframe: StackFrame, id: number) {
	const theme = useZutContext().theme;

	const stackframeClass = css`
    display: flex;
    gap: 1rem;
    padding: .5rem;
    cursor: pointer;
    align-items: center;
  
    &:hover {
      background: ${theme.hoverBackground};
    }
                             
    &.active {
      background: ${theme.activeBackground};
    }

	  &.muted {
      opacity: ${theme.mutedOpacity};

			.${mutedHiddenClass} & {
			  display: none;
			}
		}
  `;

	const frame = document.createElement("div");
	frame.className = stackframeClass;
	frame.title = `${stackframe.getFileName()}:${stackframe.getOriginalLineNumber()}:${stackframe.getOriginalColumnNumber()}`;

	if (shouldMute(stackframe.getFileName())) {
		frame.classList.add("muted");
	}

	if (!activeHasBeenSet && !shouldMute(stackframe.getFileName())) {
		activeHasBeenSet = true;
		frame.classList.add("active");
	}

	frame.addEventListener("click", () => {
		document.querySelectorAll(`.${stackframeClass}.active`).forEach((el) => {
			el.classList.remove("active");
		});

		frame.classList.add("active");

		const event = new CustomEvent("zut:change-current-frame", {
			detail: { index: id },
		});
		document.dispatchEvent(event);
	});

	const stackframeFilenameClass = css`
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; 
    direction: rtl;
    text-align: left;
    flex-grow: 1;
    font-variant-ligatures: none;
  `;

	const frameFilename = document.createElement("span");
	frameFilename.className = stackframeFilenameClass;

	const frameFilenameBdi = document.createElement("bdi");

	if (stackframe.getSource().includes("?")) {
		const splitFilename = stackframe.getSource().split("?", 2);

		const stackframeFilenameExtensionClass = css`
      opacity: ${theme.mutedOpacity};
    `;

		const filenameExtensionSpan = document.createElement("span");
		filenameExtensionSpan.className = stackframeFilenameExtensionClass;
		filenameExtensionSpan.innerText = splitFilename[1];

		frameFilenameBdi.append(
			splitFilename[0],
			filenameExtensionSpan,
			`:${stackframe.getLineNumber()}:${stackframe.getColumnNumber()}`,
		);
	} else
		frameFilenameBdi.innerText = `${stackframe.getSource()}:${stackframe.getLineNumber()}:${stackframe.getColumnNumber()}`;

	frameFilename.appendChild(frameFilenameBdi);
	frame.appendChild(frameFilename);

	const stackframeFunctionClass = css`
    opacity: ${theme.mutedOpacity};
    font-family: ${theme.monoFont};
    font-size: .8rem;
  `;

	const frameFunction = document.createElement("span");
	frameFunction.className = stackframeFunctionClass;

	if (stackframe.getFunctionName()) {
		frameFunction.innerText = stackframe.getFunctionName();
	}

	frame.appendChild(frameFunction);

	return frame;
}

export function shouldMute(path: string) {
	for (const entry of useZutContext().options.mutedEntries || []) {
		if (path.match(entry)) return true;
	}
	return false;
}