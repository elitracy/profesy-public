export const colors = {
  RED: '#E27D60',
  BLUE: '#85DCBA',
  ORANGE: '#E8A87C',
  PURPLE: '#C38D9E',
  GREEN: '#41B3A3',
  GRAY: '#5D5C61',
  GREY: '#5D5C61',
}

export function randomColor() {
  const color = Object.values(colors).slice(0, 4)[Math.floor(Math.random() * 4)]
  return color
}

export function gpaColorizer(gpa: string) {
  return parseFloat(gpa) > 3.6
    ? colors.BLUE
    : parseFloat(gpa) > 3.0
    ? colors.GREEN
    : parseFloat(gpa) > 2.4
    ? colors.ORANGE
    : colors.RED
}
