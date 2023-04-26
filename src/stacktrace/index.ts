import ErrorStackParser from "error-stack-parser";
import {SourceMapConsumer} from "source-map";
import {getFileName, getRawSourceMap, getStackframeSource} from "./utils";
import {findFunctionName} from "./find-function-name";

export interface StackFrame {
  getIsConstructor(): boolean | undefined;
  getIsEval(): boolean | undefined;
  getIsNative(): boolean | undefined;
  getIsToplevel(): boolean | undefined;
  getOriginalColumnNumber(): number;
  getOriginalLineNumber(): number;
  getColumnNumber(): number;
  getLineNumber(): number;
  getFileName(): string;
  getFunctionName(): string;
  getSource(): string;
  getSourceContent(): string;
}

export async function parseError(error: Error): Promise<StackFrame[]> {
  const initialFrames = ErrorStackParser.parse(error);
  const frames: StackFrame[] = [];
  
  for (const frame of initialFrames) {
    frames.push(await enhanceFrame(frame as unknown as StackFrame));
  }

  return frames;
}

async function enhanceFrame(frame: StackFrame): Promise<StackFrame> {
  const source = await getStackframeSource(frame);
  const rawSourceMap = await getRawSourceMap(source, frame.getFileName());
  const consumer = rawSourceMap ? await new SourceMapConsumer(rawSourceMap) : undefined;
  
  const mappedPosition = consumer ? consumer.originalPositionFor({
    line: frame.getLineNumber(),
    column: frame.getColumnNumber(),
  }) : undefined;
  
  const result = {
    getIsConstructor(): boolean | undefined {
      return frame.getIsConstructor();
    },
    
    getIsEval(): boolean | undefined {
      return frame.getIsEval();
    },
    
    getIsNative(): boolean | undefined {
      return frame.getIsNative();
    },
    
    getIsToplevel(): boolean | undefined {
      return frame.getIsToplevel();
      },

    getOriginalLineNumber(): number {
      return frame.getLineNumber();
      },

    getOriginalColumnNumber(): number {
      return frame.getColumnNumber();
      },
    
    getLineNumber(): number {
      return mappedPosition?.line || frame.getLineNumber();
    },

    getColumnNumber(): number {
      return mappedPosition?.column || frame.getColumnNumber();
    },
    
    getFileName(): string {
      return frame.getFileName();
    },

    getSource(): string {
      return mappedPosition?.source || frame.getFileName();
    },
    
    getSourceContent(): string {
      // @ts-ignore: Doesn't work?
      return consumer?.sourceContentFor(mappedPosition?.source || getFileName(frame.getFileName())) || source;
    },
    
    getFunctionName(): string {
      return findFunctionName(this.getSourceContent(), this.getLineNumber()) || frame.getFunctionName();
    }
  };

  consumer?.destroy();
  
  return result;
}