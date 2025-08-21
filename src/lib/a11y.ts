import axe from 'axe-core';

export async function runAxe(node:HTMLElement) {
  return await axe.run(node);
}
