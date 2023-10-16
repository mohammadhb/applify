const MAIN_DB = "MAIN_DB", APPLIES_KEY = "applies", TAGS_KEY = "tags", SESSIONS_KEY = "sessions";
const menuButtonIds = [
    "#applies-btn",
    "#tags-btn",
    "#sessions-btn",
    "#options-btn"
];

async function fetchAllEntities(){
    const db = await chrome.storage.sync.get([APPLIES_KEY, TAGS_KEY, SESSIONS_KEY])
    return db;
}


function prepareItemsForNewTable(items){

    let heads = [];
    const entities = [];
    console.log(items)
    items.forEach(item => {
        heads = [...Object.keys(item), ...heads]
    });
    heads = new Set(heads);
    
    items.forEach(item => {
        const entity = {};
        heads.forEach(head=>{
            if(item[head]){
                entity[head] = item[head];
            }else {
                entity[head] = "-None-";
            }
        });
        entities.push(entity);
    });
    
    return [Array.from(heads), entities];

}

function deleteTag(tagId){
    console.log(tagId)
}

function editTag(tagId){
    console.log(tagId)
}

function loadTagsContent({tags}){
    
    const [heads, entities] = prepareItemsForNewTable(tags);
    console.log(heads, entities)
    heads.push("Actions")
    document.querySelector("#applify-table thead tr").innerHTML = heads.map(head=>`<th>${head}</th>`).join("")
    document.querySelector("#applify-table tbody").innerHTML = entities.map(entity=>{
        console.log(entity)
        return `<tr>
            ${
                Object.values(entity).map(entityValue=>{
                    console.log(entity)
                    return `<td>${entityValue}</td>`
                }).join("")
            }
            <td>
                <button data-tag-id="${entity.name}" class="button is-danger is-outlined applify-delete-tag-action">
                    <span class="icon is-small">
                        <i class="fas fa-times"></i>
                    </span>
                    <span>Delete Tag</span>
                </button>
            </td>
            <td>
                <button data-tag-id="${entity.name}" class="button is-info is-outlined applify-edit-tag-action">
                    <span class="icon is-small">
                        <i class="fas fa-edit"></i>
                    </span>
                    <span>Edit Tag</span>
                </button>
            </td>
        </tr>`;
    }).join("");

    document.querySelectorAll(".applify-delete-tag-action").forEach(node=>{
        node.addEventListener("click", (event)=>{
            deleteTag(event.currentTarget.dataset.tagId)
        })
    });

    document.querySelectorAll(".applify-edit-tag-action").forEach(node=>{
        node.addEventListener("click", (event)=>{
            editTag(event.currentTarget.dataset.tagId)
        })
    })
}

function loadAppliesContent({applies}){
    
    const [heads, entities] = prepareItemsForNewTable(applies);
    console.log(heads, entities)
    heads.push("Actions")
    document.querySelector("#applify-table thead tr").innerHTML = heads.map(head=>`<th>${head}</th>`).join("")
    document.querySelector("#applify-table tbody").innerHTML = entities.map(entity=>{
        console.log(entity)
        return `<tr>
            ${
                Object.values(entity).map(entityValue=>{
                    console.log(entity)
                    return `<td>${entityValue}</td>`
                }).join("")
            }
            <td>
                <button data-tag-id="${entity.name}" class="button is-danger is-outlined applify-delete-tag-action">
                    <span class="icon is-small">
                        <i class="fas fa-times"></i>
                    </span>
                    <span>Delete Tag</span>
                </button>
            </td>
            <td>
                <button data-tag-id="${entity.name}" class="button is-info is-outlined applify-edit-tag-action">
                    <span class="icon is-small">
                        <i class="fas fa-edit"></i>
                    </span>
                    <span>Edit Tag</span>
                </button>
            </td>
        </tr>`;
    }).join("");

    document.querySelectorAll(".applify-delete-tag-action").forEach(node=>{
        node.addEventListener("click", (event)=>{
            deleteTag(event.currentTarget.dataset.tagId)
        })
    });

    document.querySelectorAll(".applify-edit-tag-action").forEach(node=>{
        node.addEventListener("click", (event)=>{
            editTag(event.currentTarget.dataset.tagId)
        })
    })
}

function loadSessionsContent({sessions}){
    
    const [heads, entities] = prepareItemsForNewTable(sessions);
    console.log(heads, entities)
    heads.push("Actions")
    document.querySelector("#applify-table thead tr").innerHTML = heads.map(head=>`<th>${head}</th>`).join("")
    document.querySelector("#applify-table tbody").innerHTML = entities.map(entity=>{
        console.log(entity)
        return `<tr>
            ${
                Object.values(entity).map(entityValue=>{
                    console.log(entity)
                    return `<td>${entityValue}</td>`
                }).join("")
            }
            <td>
                <button data-tag-id="${entity.name}" class="button is-danger is-outlined applify-delete-tag-action">
                    <span class="icon is-small">
                        <i class="fas fa-times"></i>
                    </span>
                    <span>Delete Tag</span>
                </button>
            </td>
            <td>
                <button data-tag-id="${entity.name}" class="button is-info is-outlined applify-edit-tag-action">
                    <span class="icon is-small">
                        <i class="fas fa-edit"></i>
                    </span>
                    <span>Edit Tag</span>
                </button>
            </td>
        </tr>`;
    }).join("");

    document.querySelectorAll(".applify-delete-tag-action").forEach(node=>{
        node.addEventListener("click", (event)=>{
            deleteTag(event.currentTarget.dataset.tagId)
        })
    });

    document.querySelectorAll(".applify-edit-tag-action").forEach(node=>{
        node.addEventListener("click", (event)=>{
            editTag(event.currentTarget.dataset.tagId)
        })
    })
}

function loadOptionsContent({options}){
    
    const [heads, entities] = prepareItemsForNewTable(options);
    console.log(heads, entities)
    heads.push("Actions")
    document.querySelector("#applify-table thead tr").innerHTML = heads.map(head=>`<th>${head}</th>`).join("")
    document.querySelector("#applify-table tbody").innerHTML = entities.map(entity=>{
        console.log(entity)
        return `<tr>
            ${
                Object.values(entity).map(entityValue=>{
                    console.log(entity)
                    return `<td>${entityValue}</td>`
                }).join("")
            }
            <td>
                <button data-tag-id="${entity.name}" class="button is-danger is-outlined applify-delete-tag-action">
                    <span class="icon is-small">
                        <i class="fas fa-times"></i>
                    </span>
                    <span>Delete Tag</span>
                </button>
            </td>
            <td>
                <button data-tag-id="${entity.name}" class="button is-info is-outlined applify-edit-tag-action">
                    <span class="icon is-small">
                        <i class="fas fa-edit"></i>
                    </span>
                    <span>Edit Tag</span>
                </button>
            </td>
        </tr>`;
    }).join("");

    document.querySelectorAll(".applify-delete-tag-action").forEach(node=>{
        node.addEventListener("click", (event)=>{
            deleteTag(event.currentTarget.dataset.tagId)
        })
    });

    document.querySelectorAll(".applify-edit-tag-action").forEach(node=>{
        node.addEventListener("click", (event)=>{
            editTag(event.currentTarget.dataset.tagId)
        })
    })
}

function setButtonActiveAndLoadContent(button){

    const contents = {
        "#applies-btn": loadAppliesContent,
        "#tags-btn": loadTagsContent,
        "#sessions-btn": loadSessionsContent,
        "#options-btn": loadOptionsContent
    }

    button.classList.remove("is-outlined");
    
    (async function(){
        console.log(button);
        contents[`#${button.id}`](await fetchAllEntities());
    })();
    

}

function setAllButtonsListeners(){

    menuButtonIds.forEach(buttonId=>{
        const button = document.querySelector(buttonId);
        button.addEventListener("click", (event)=>{
            resetAllButtons();
            setButtonActiveAndLoadContent(button);
        })
    });

}

function resetAllButtons(){

    menuButtonIds.forEach(buttonId=>{
        const button = document.querySelector(buttonId);
        button.classList.add("is-outlined");
    });

}


window.addEventListener('DOMContentLoaded', function() {

    (async function(){
        loadTagsContent(await fetchAllEntities());
    })();

    resetAllButtons();
    setAllButtonsListeners();

});