// Example: Network requests
window.onload = async () => {
    // Pure functions
    const appendChild = parent => child => parent.appendChild(child);
    const getElementById = doc => idString => doc.getElementById(idString);
    const yieldWrappingElement = doc => doc.createElement('div');
    const yieldFirstComponent = PromiseConstructor => timeoutUtility => ({
        content: '<div>do something</div>',
        state: new PromiseConstructor((res, rej) => {
            const button = document.createElement('button');
            button.innerHTML = 'temporary button thingy';
            document.body.appendChild(button);
            button.onclick = () => res({ newState: 'first component state' });
        })
    });
    const yieldSecondComponent = PromiseConstructor => timeoutUtility => ({
        content: '<div>This is inside another div</div>',
        state: new PromiseConstructor((res, rej) => {
            timeoutUtility(() => res({ newState: 'second component state' }), 1000)
        })
    });

    // this function seems dangerous...
    const assignComponentToWrapper = wrapper => component => {
        wrapper.innerHTML = component.content;
        return component.state;
    }

    // Pure program
    const asyncAppendChildToTestBodyEffect = AsyncEffect.of('testbody').ap(AsyncEffect.of(window.document).map(getElementById)).map(appendChild);
    const rootElementEffect = AsyncEffect.of(window.document).map(yieldWrappingElement);
    const firstComponentEffect = AsyncEffect.of(setTimeout).ap(AsyncEffect.of(Promise).map(yieldFirstComponent));
    const secondComponentEffect = AsyncEffect.of(setTimeout).ap(AsyncEffect.of(Promise).map(yieldSecondComponent));

    const firstComponentStep = firstComponentEffect.ap(rootElementEffect.map(assignComponentToWrapper))
    const secondComponentStep = secondComponentEffect.ap(rootElementEffect.map(assignComponentToWrapper))

    const program = rootElementEffect.ap(asyncAppendChildToTestBodyEffect)
        .map(async rootElement => {
            const firstComponentStep = firstComponentEffect.ap(AsyncEffect.of(rootElement).map(assignComponentToWrapper));
            const secondComponentStep = secondComponentEffect.ap(AsyncEffect.of(rootElement).map(assignComponentToWrapper));

            await firstComponentStep.run();
            await secondComponentStep.run();
        })

    program.run();
}
