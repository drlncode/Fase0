export function lockScroll() {
    const width = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.paddingRight = `${width}px`;
}

export function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.documentElement.style.paddingRight = '';
}
