/*
    COMMUNICATION
*/
async function search(query){
    if(query){
        return await chrome.runtime.sendMessage({
            type: "search",
            options: {
                query
            }
        })
    }
    return await chrome.runtime.sendMessage({
        type: "fetchAll",
    })
}

async function addTag(name, value){
    chrome.runtime.sendMessage({
        type: "addTag",
        options: {
            name,
            value
        }
    })
}

async function addTagToSession(name, value){
    chrome.runtime.sendMessage({
        type: "addTagToSession",
        options: {
            name,
            value
        }
    })
}


/*
    SCRIPTS
*/
function createElement(id, styles={}, classes=[], type = "div"){
    let element = document.createElement(type);
    if(id) element.id = id;
    if(classes.length) element.classList.add(classes);
    if(Object.values(styles).length) Object.entries(styles).forEach(([style, property])=>element.style[style]=property);
    return element;
}

function wrapElement(element, wrapperElement){

    // insert wrapper before el in the DOM tree
    element.parentNode.insertBefore(wrapperElement, element);
    
    // move el into wrapper
    wrapperElement.appendChild(element);
}

function convertTextToElement(text){
    const template = document.createElement("template");
    template.innerHTML = text;
    return template.content.firstElementChild;
}


const categorizedInputs = {
    texts: document.querySelectorAll('input[type=text]'),
    emails: document.querySelectorAll('input[type=email]'),
    tels: document.querySelectorAll('input[type=tel]'),
    textareas: document.querySelectorAll('textarea'),
}

function createDivWithARelativePosition() {
    const id = "DID"+self.crypto.randomUUID();
    const element = createElement(id, {position: "relative"}, ["applify-wrapping-container"])
    return element;
}
categorizedInputs.texts.forEach((element)=>{
    const wrapperElement = createDivWithARelativePosition();
    wrapperElement.dataset.applifyTagSelect=0;
    wrapElement(element, wrapperElement);
})

function createAutoComplete() {
    const id = "DID"+self.crypto.randomUUID();
    return [
    convertTextToElement(`
        <div id=${id} class="box applify-wrapping-autocomplete hidden"></div>
    `),
    id
    ];
}

document.querySelectorAll(".applify-wrapping-container")
.forEach((element)=>{
    element.append(createAutoComplete()[0])
})

categorizedInputs.texts.forEach(element=>{
    element.addEventListener("input", async function(event) {

        const nextSibling = event.currentTarget.nextSibling;
        const value = event.currentTarget.value;
        event.currentTarget.parentNode.dataset.applifyTagSelect = 0;

        let results;

        results = await search(value);

        updateAutoCompleteOptions([
            ...results.tags.map(result=>{
                return {
                    icon: "tags",
                    value: result.value,
                    text: result.name
                }
            }),
            {
                creator: true,
                icon: "plus",
                value,
                text: `Add "${value}" to Tags`
            }
        ])

        nextSibling.classList.remove("hidden");
        
    });

    element.addEventListener("blur", function(event){
        console.log("blr");
        const { currentTarget } = event;
        document.querySelector(`#${currentTarget.parentNode.id} .applify-wrapping-autocomplete`).classList.add("hidden");
    });

    element.addEventListener("focus", async function(event){
        const { currentTarget } = event;
        console.log("fcs");
        const input = currentTarget,
            autocompleteElement = document.querySelector(`#${currentTarget.parentNode.id} .applify-wrapping-autocomplete`);
        
        const value = input.value;
        const results = await search(value);

        updateAutoCompleteOptions([
            ...results.tags.map(result=>{
                return {
                    icon: "tags",
                    value: result.value,
                    text: result.name
                }
            }),
            {
                creator: true,
                icon: "plus",
                value,
                text: `Add "${value}" to Tags`
            }
        ]);

        // currentTarget.parentNode.dataset.applifyTagSelect = 0;
        // autocompleteElement.childNodes[0].dispatchEvent(new MouseEvent("hover", {'bubbles': true}));

        autocompleteElement.classList.remove("hidden");

    });

    // element.addEventListener("keydown", function(event){
    //     const {code , currentTarget} = event;

    //     if(code == "ArrowDown"){
    //         let index = +currentTarget.parentNode.dataset.applifyTagSelect;
    //         const autocomplete = document.querySelector(`#${currentTarget.parentNode.id} .applify-wrapping-autocomplete`);
    //         const limit = autocomplete.childNodes.length-1;
    //         console.log(index)
    //         if(index<limit){
    //             currentTarget.parentNode.dataset.applifyTagSelect = ++index;
    //             autocomplete.childNodes[index].dispatchEvent(new MouseEvent("hover", {'bubbles': true}));
    //         }
            
    //     }
        
    // });

})

function updateAutoCompleteOptions(items = [], wrapperQuery = ".applify-wrapping-autocomplete"){

    document
    .querySelectorAll(wrapperQuery)
    .forEach((element)=>{
        element
        .innerHTML = 

        items
        .map(item=>
            `
            <a class="panel-block is-active applify-tag-${item.creator?"new":"existing"}" data-applify-tag="${item.value}" data-applify-tag-name="${item.text}">
                <span class="panel-icon">
                    <i class="fa fa-${item.icon}" aria-hidden="true"></i>
                </span>
                ${item.text}
            </a>
            `
        )
        .join("")
    })

    document
    .querySelectorAll(".applify-tag-new")
    .forEach((tag)=>{
        tag.addEventListener("click", function(event) {
            const value = event.currentTarget.dataset.applifyTag;
            createOneInputModal("Saving Tag...", "Tag Name", function(tagName){
                addTag(tagName, value);
                event.target.parentNode.classList.add("hidden");
            });
            
        });
    })

    document
    .querySelectorAll(".applify-tag-existing")
    .forEach((tag)=>{
        tag.addEventListener("mousedown", function(event) {
            
            const value = event.currentTarget.dataset.applifyTag;
            const name = event.currentTarget.dataset.applifyTagName;
            const parent = event.currentTarget.parentNode;
            addTagToSession(name, value)
            
            parent.previousElementSibling.value = value;
            parent.classList.add("hidden");
        });
    })

}

function createOneInputModal(title, placeholder, onSave){

    const successId = "DID"+self.crypto.randomUUID();
    const cancelId = "DID"+self.crypto.randomUUID();
    const textId = "DID"+self.crypto.randomUUID();

    const modal =
    `
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">${title}</p>
                <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <input id="${textId}" class="input is-rounded" type="text" placeholder="${placeholder}">
            </section>
            <footer class="modal-card-foot">
                <button id="${successId}" class="button is-success">Save changes</button>
                <button id="${cancelId}" class="button">Cancel</button>
            </footer>
        </div>
    </div>
    `

    const element = convertTextToElement(modal);
    document.getElementsByTagName("body")[0].append(element);

    document.getElementById(successId).addEventListener("click", function (){
        onSave(document.getElementById(textId).value);
        element.remove();
    });
}

updateAutoCompleteOptions();

// $(".applify-wrapping-autocomplete").html(`<progress class="progress is-small" max="100"></progress>`);
