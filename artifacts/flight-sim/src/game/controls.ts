export enum Controls {
  pitchUp = 'pitchUp',
  pitchDown = 'pitchDown',
  rollLeft = 'rollLeft',
  rollRight = 'rollRight',
  yawLeft = 'yawLeft',
  yawRight = 'yawRight',
  throttleUp = 'throttleUp',
  throttleDown = 'throttleDown',
  reset = 'reset',
  fireGuns = 'fireGuns',
  fireMissile = 'fireMissile',
  openMap = 'openMap',
}

export const controlsMap = [
  { name: Controls.pitchUp, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.pitchDown, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.rollLeft, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.rollRight, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.yawLeft, keys: ['KeyQ'] },
  { name: Controls.yawRight, keys: ['KeyE'] },
  { name: Controls.throttleUp, keys: ['ShiftLeft', 'ShiftRight'] },
  { name: Controls.throttleDown, keys: ['ControlLeft', 'ControlRight'] },
  { name: Controls.reset, keys: ['KeyR'] },
  { name: Controls.fireGuns, keys: ['Space'] },
  { name: Controls.fireMissile, keys: ['KeyX'] },
  { name: Controls.openMap, keys: ['KeyM'] },
];
