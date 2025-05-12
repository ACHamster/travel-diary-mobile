export type Line = number;
export type Lines = number;

export const TotalLines = 31;

export const NoLines: Lines = /*                       */ 0b0000000;
export const NoLine: Line = /*                         */ 0b0000000;

// 审核状态
export const ApprovedLine: Line = /*                   */ 0b1000000;
export const PendingLine: Line = /*                    */ 0b0100000;
export const RejectedLine: Line = /*                   */ 0b0010000;
export const DeletedLine: Line = /*                    */ 0b0001000;

export const VideoLine: Line = /*                      */ 0b0000100;

export function mergeLines(line1: Lines, line2: Lines): Lines {
  return line1 | line2;
}

export function removeLine(line: Lines, lineToRemove: Line): Lines {
  return line & ~lineToRemove;
}

export function includeSomeLine(a: Line | Lines, b: Line | Lines): boolean {
  return (a & b) !== NoLines;
}

