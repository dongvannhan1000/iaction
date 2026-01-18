/**
 * Smooth scroll to a section by ID
 * Handles the case where user is already at the target position
 */
export function scrollToSection(targetId: string, offset: number = 100) {
    const element = document.getElementById(targetId);

    if (!element) return;

    const targetPosition = element.offsetTop - offset;
    const currentPosition = window.scrollY;

    // If already at or very close to the target, do a small scroll first to trigger animation
    if (Math.abs(currentPosition - targetPosition) < 10) {
        // Scroll slightly away first, then back to target
        window.scrollTo({
            top: targetPosition + 1,
            behavior: "instant",
        });
    }

    // Now scroll to the actual target
    requestAnimationFrame(() => {
        window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
        });
    });
}

/**
 * Scroll handler for anchor elements
 */
export function handleScrollClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
    offset: number = 100,
    onComplete?: () => void
) {
    e.preventDefault();
    scrollToSection(targetId, offset);

    // Update URL hash without triggering native scroll
    if (window.history) {
        window.history.pushState(null, "", `#${targetId}`);
    }

    if (onComplete) {
        onComplete();
    }
}
