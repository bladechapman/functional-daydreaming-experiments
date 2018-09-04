// Example: Network requests
window.onload = async () => {
    // Pure functions
    const assignInnerHTMLToElement = element => innerHTML => {
        element.innerHTML = innerHTML;
        return element;
    };
    const appendChild = parent => child => parent.appendChild(child);
    const getElementById = doc => idString => doc.getElementById(idString);
    const wrappingElement = document.createElement('div');

    // Pure program
    const asyncGetElementByIdFromDocumentEffect = AsyncEffect.of(window.document).map(getElementById);
    const asyncAppendChildToTestBodyEffect = AsyncEffect.of('testbody').ap(asyncGetElementByIdFromDocumentEffect).map(appendChild);
    const yieldFirstComponent = PromiseConstructor => timeoutUtility => ({
        content: 'first component',
        state: new PromiseConstructor((res, rej) => {
            timeoutUtility(() => res({ newState: 'some new state' }), 1000)
        })
    });
    const yieldFirstComponentEffect = AsyncEffect.of(setTimeout).ap(AsyncEffect.of(Promise).map(yieldFirstComponent));
    const firstComponentStep = wrapper => {
        const assignInnerHtmlToWrapper = AsyncEffect.of(wrapper).map(assignInnerHTMLToElement);
        return yieldFirstComponentEffect.map(component => {
            return AsyncEffect.of(component.content)
                .ap(assignInnerHtmlToWrapper)
                .map(async () => await component.state)
                .run()
        }).run();
    }
    const logStep = logger => loggee => { logger.log(loggee) }
    const consoleLogEffect = AsyncEffect.of(console).map(logStep);

    // Effectful execution
    AsyncEffect.of(wrappingElement)
        .ap(asyncAppendChildToTestBodyEffect)
        .map(firstComponentStep)
        .ap(consoleLogEffect)
        .run()

}
