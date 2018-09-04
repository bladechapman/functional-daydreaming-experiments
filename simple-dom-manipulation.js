// Example: DOM manipulation
window.onload = async () => {
    // Pure functions
    const assignInnerHTMLToElement = element => innerHTML => {
        element.innerHTML = innerHTML;
        return element;
    };
    const appendChild = parent => child => parent.appendChild(child);
    const getElementById = doc => idString => doc.getElementById(idString);

    // Pure program
    const wrappingElement = document.createElement('div');
    const assignInnerHTMLToWrappingElementEffect = Effect.of(wrappingElement).map(assignInnerHTMLToElement);
    const getElementByIdFromDocumentEffect = Effect.of(window.document).map(getElementById);
    const appendChildToTestBodyEffect = Effect.of('testbody').ap(getElementByIdFromDocumentEffect).map(appendChild);
    const program = Effect.of('Some Contents').ap(assignInnerHTMLToWrappingElementEffect).ap(appendChildToTestBodyEffect);

    // Effectful execution
    program.run();

}
