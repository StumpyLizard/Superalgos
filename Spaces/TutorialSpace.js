function newTutorialSpace() {
    const MODULE_NAME = 'Tutorial Space'
    let thisObject = {
        stop: stop,
        skip: skip,
        done: done,
        playTutorial: playTutorial,
        resumeTutorial: resumeTutorial,
        playTutorialTopic: playTutorialTopic,
        resumeTutorialTopic: resumeTutorialTopic,
        playTutorialStep: playTutorialStep,
        resumeTutorialStep: resumeTutorialStep,
        tutorialTopicDone: tutorialTopicDone,
        tutorialStepDone: tutorialStepDone,
        resetTutorialProgress: resetTutorialProgress,
        container: undefined,
        physics: physics,
        draw: draw,
        getContainer: getContainer,
        initialize: initialize,
        finalize: finalize
    }

    let isInitialized = false

    thisObject.container = newContainer()
    thisObject.container.name = MODULE_NAME
    thisObject.container.initialize()
    thisObject.container.isClickeable = true
    thisObject.container.isDraggeable = false
    thisObject.container.detectMouseOver = true
    thisObject.container.status = 'hidden'

    resize()

    let browserResizedEventSubscriptionId

    let tutorialRootNode
    let currentNode
    let currentStatus = 'Stopped'

    let tutorialDiv = document.getElementById('tutorialDiv')
    let tutorialFormDiv = document.getElementById('tutorialFormDiv')
    let htmlImage = document.createElement("IMG")
    let currentImageName  = 'Never Set'
    let newImageName = 'Never Set'

    return thisObject

    function initialize() {
        browserResizedEventSubscriptionId = canvas.eventHandler.listenToEvent('Browser Resized', resize)
        isInitialized = true
    }

    function finalize() {
        canvas.eventHandler.stopListening(browserResizedEventSubscriptionId)

        tutorialRootNode = undefined
        currentNode = undefined

        tutorialDiv = undefined
        tutorialFormDiv = undefined
        image = undefined
    }

    function resize() {
        thisObject.container.frame.width = 0
        thisObject.container.frame.height = 0
    }

    function getContainer(point, purpose) {
        let container

        if (thisObject.container.frame.isThisPointHere(point, true) === true) {
            return thisObject.container
        } else {
            return undefined
        }
    }

    function physics() {
        if (currentNode === undefined) { return }

        switch (currentStatus) {
            case 'Stopped': {
                makeInvisible()
                currentNode = undefined
                break
            }
            case 'Playing Tutorial': {
                makeVsible()
                break
            }
            case 'Playing Topic': {
                makeVsible()
                break
            }
            case 'Playing Step': {
                makeVsible()
                break
            }
        }

        checkImage()
        checkReference()
        return

        function checkImage() {
            let tutorialImageDiv = document.getElementById('tutorialImageDiv')
            if (tutorialImageDiv !== null && tutorialImageDiv !== undefined) {
                tutorialImageDiv.appendChild(htmlImage)
            }
            
            if (currentImageName === newImageName) {return}
            currentImageName = newImageName
            htmlImage.src = 'Images/Icons/style-01/' + currentImageName + '.png'
            htmlImage.width = "100"
            htmlImage.height = "100"
        }

        function checkReference() {
            /* 
            If there is a reference parent defined, we will highlight it 
            and move the designer so that that node be at the center of the screen.
            */

            if (currentNode !== undefined) {
                if (currentNode.payload !== undefined) {
                    if (currentNode.payload.referenceParent !== undefined) {
                        if (currentNode.payload.referenceParent.payload !== undefined) {
                            if (currentNode.payload.referenceParent.payload.uiObject !== undefined) {
                                canvas.floatingSpace.positionAtNode(currentNode.payload.referenceParent)
                                currentNode.payload.referenceParent.payload.uiObject.highlight()
                            }
                        }
                    }
                }
            }
        }

        function makeInvisible() {
            const HEIGHT = 0
            const WIDTH = 0
            const FORM_HEIGHT = 0

            tutorialPosition = {
                x: 100000,
                y: 100000
            }

            tutorialDiv.style = '   ' +
                'position:fixed; top:' + tutorialPosition.y + 'px; ' +
                'left:' + tutorialPosition.x + 'px; ' +
                'width: ' + WIDTH + 'px;' +
                'height: ' + HEIGHT + 'px;' +
                'z-index:1;'

            tutorialFormDiv.style = '   ' +
                'position:fixed; top:' + (tutorialPosition.y) + 'px; ' +
                'left:' + tutorialPosition.x + 'px; ' +
                'width: ' + WIDTH + 'px;' +
                'height: ' + FORM_HEIGHT + 'px;' +
                'z-index:1;'
        }

        function makeVsible() {
            const HEIGHT = 650
            const WIDTH = 400
            const MARGIN = 300
            const FORM_HEIGHT = 80

            tutorialPosition = {
                x: MARGIN,
                y: (browserCanvas.height - HEIGHT) / 2
            }

            tutorialDiv.style = '   ' +
                'position:fixed; top:' + tutorialPosition.y + 'px; ' +
                'left:' + tutorialPosition.x + 'px; ' +
                'width: ' + WIDTH + 'px;' +
                'height: ' + HEIGHT + 'px;' +
                'z-index:1;'

            buildHTML()

            tutorialFormDiv.style = '   ' +
                'position:fixed; top:' + (tutorialPosition.y + HEIGHT - FORM_HEIGHT) + 'px; ' +
                'left:' + tutorialPosition.x + 'px; ' +
                'width: ' + WIDTH + 'px;' +
                'height: ' + FORM_HEIGHT + 'px;' +
                'z-index:1;'
        }
    }

    function playTutorial(node) {
        tutorialRootNode = node
        currentNode = node
        currentStatus = 'Playing Tutorial'
    }

    function resumeTutorial(node) {

    }

    function stop() {
        tutorialRootNode = undefined
        currentStatus = 'Stopped'
    }

    function skip() {

    }

    function done() {
        /* If we are standing at the Tutorial Node, we do this. */
        advance()
    }

    function playTutorialTopic(node) {
        currentTopicNode = node
        currentNode = node
        currentStatus = 'Playing Topic'
        findTutorialNode(node)
    }

    function resumeTutorialTopic(node) {

    }

    function playTutorialStep(node) {
        currentStepNode = node
        currentNode = node
        currentStatus = 'Playing Step'
        findTutorialNode(node)
    }

    function resumeTutorialStep(node) {

    }

    function tutorialTopicDone() {

    }

    function tutorialStepDone() {

    }

    function resetTutorialProgress() {

    }

    function findTutorialNode(node) {
        /* 
        We will consider the tutorialRootNode the head of the hirierchy
        */
        tutorialRootNode = node

        if (node.payload !== undefined) {
            if (node.payload.parentNode !== undefined) {
                findTutorialNode(node.payload.parentNode)
            }
        }
    }

    function advance() {
        let found
        let advanced

        switch (currentStatus) {
            case 'Playing Tutorial': {
                found = true
                findNextNode(tutorialRootNode)
                break
            }
            case 'Playing Topic': {
                found = false
                findNextNode(tutorialRootNode)
                break
            }
            case 'Playing Step': {
                found = false
                findNextNode(tutorialRootNode)
                break
            }
        }

        /* 
        If we can not find a next node, then we stop the tutorial.
        */
        if (advanced === undefined) {
            stop()
            return
        }

        /* 
        If there is a reference parent defined, we will uncollape the brach where it belongs.
        */
        if (currentNode.payload.referenceParent !== undefined) {
            if (currentNode.payload.referenceParent.payload !== undefined) {
                if (currentNode.payload.referenceParent.payload.floatingObject !== undefined) {
                    currentNode.payload.referenceParent.payload.floatingObject.unCollapseParent()
                }
            }
        }

        function findNextNode(node) {

            for (let i = 0; i < node.tutorialSteps.length; i++) {

                let tutorialStep = node.tutorialSteps[i]
                if (found === true) {
                    currentNode = tutorialStep
                    currentStatus = 'Playing Step'
                    advanced = true
                    return
                }
                if (tutorialStep.id === currentNode.id) {
                    found = true
                }
            }

            for (let i = 0; i < node.tutorialTopics.length; i++) {

                if (advanced === true) {
                    return
                }

                let tutorialTopic = node.tutorialTopics[i]
                if (found === true) {
                    currentNode = tutorialTopic
                    currentStatus = 'Playing Topic'
                    advanced = true
                    return
                }
                if (tutorialTopic.id === currentNode.id) {
                    found = true
                }

                findNextNode(tutorialTopic, found)
            }
        }
    }

    function buildHTML() {

        let nodeConfig = JSON.parse(currentNode.config)
        let html = ''
        if (nodeConfig.title !== undefined && nodeConfig.title !== '') {
            html = html + '<div><h1 class="tutorial-saira-large">' + nodeConfig.title + '</h1></div>'
        }
        html = html + '<div>'
        if (nodeConfig.summary !== undefined && nodeConfig.summary !== '') {
            html = html + '<div class="tutorial-summary">' + nodeConfig.summary + '</div>'
        }
        if (nodeConfig.subTitle !== undefined && nodeConfig.subTitle !== '') {
            html = html + '<h2 class="tutorial-saira-medium">' + nodeConfig.subTitle + '</h2>'
        }
        if (nodeConfig.definition !== undefined && nodeConfig.definition !== '') {
            html = html + '<table class="tutorial-definitionTable">'
            html = html + '<tr>'
            html = html + '<td>'
            if (nodeConfig.image !== undefined && nodeConfig.image !== '') {
                html = html + '<div id="tutorialImageDiv" width="100" height="100"/>'
                newImageName = nodeConfig.image
            }
            html = html + '</td>'
            html = html + '<td>'
            html = html + '<strong class="tutorial-saira-bold-small">' + nodeConfig.definition + '</strong>'
            html = html + '</td>'
            html = html + '</tr>'
            html = html + '</table>'
        }
        if (nodeConfig.bulletListIntro !== undefined && nodeConfig.bulletListIntro !== '') {
            html = html + '<p class="tutorial-saira-small">' + nodeConfig.bulletListIntro + '</p>'
        }
        if (nodeConfig.bulletArray !== undefined) {
            html = html + '<ul>'
            for (let i = 0; i < nodeConfig.bulletArray.length; i++) {
                let bullet = nodeConfig.bulletArray[i]
                html = html + '<li>'
                html = html + '<p class="tutorial-saira-small"><strong class="tutorial-saira-bold-small">' + bullet[0] + ':</strong> ' + bullet[1] + '</p>'
                html = html + '</li>'
            }
            html = html + '</ul>'
        }
        if (nodeConfig.paragraph1 !== undefined && nodeConfig.paragraph1 !== '') {
            html = html + '<p class="tutorial-saira-small">' + nodeConfig.paragraph1 + '</p>'
        }
        if (nodeConfig.callOut !== undefined && nodeConfig.callOut !== '') {
            html = html + '<div class="tutorial-saira-bold-small tutorial-callout" > ' + nodeConfig.callOut + '</div>'
        }
        if (nodeConfig.paragraph2 !== undefined && nodeConfig.paragraph2 !== '') {
            html = html + '<p class="tutorial-saira-small">' + nodeConfig.paragraph2 + '</p>'
        }
        if (nodeConfig.paragraph2 !== undefined && nodeConfig.paragraph2 !== '') {
            html = html + '<p class="tutorial-saira-small">' + nodeConfig.paragraph2 + '</p>'
        }
        if (nodeConfig.note !== undefined && nodeConfig.note !== '') {
            html = html + '<div class="tutorial-saira-bold-small tutorial-alert-info" role="alert"><i class="tutorial-fa tutorial-info-circle"></i> <b>Note:</b> ' + nodeConfig.note + '</div>'
        }
        if (nodeConfig.tip !== undefined && nodeConfig.tip !== '') {
            html = html + '<div class="tutorial-saira-bold-small tutorial-alert-success" role="alert"><i class="tutorial-fa tutorial-check-square-o"></i> <b>Tip:</b> ' + nodeConfig.tip + '</div>'
        }
        if (nodeConfig.important !== undefined && nodeConfig.important !== '') {
            html = html + '<div class="tutorial-saira-bold-small tutorial-alert-warning" role="alert"><i class="tutorial-fa tutorial-warning"></i> <b>Important:</b> ' + nodeConfig.important + '</div>'
        }
        if (nodeConfig.warning !== undefined && nodeConfig.warning !== '') {
            html = html + '<div class="tutorial-saira-bold-small tutorial-alert-warning" role="alert"><i class="tutorial-fa tutorial-warning"></i> <b>Important:</b> ' + nodeConfig.warning + '</div>'
        }
        html = html + '</div>'

        tutorialDiv.innerHTML = html
    }

    function draw() {
        if (isInitialized === false) { return }
    }
}
