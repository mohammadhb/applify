const MAIN_DB = "MAIN_DB", APPLIES_KEY = "applies", TAGS_KEY = "tags", SESSIONS_KEY = "sessions", SESSION_KEY = "session";

async function fetchAllEntities() {
    const db = await chrome.storage.sync.get([APPLIES_KEY, TAGS_KEY, SESSIONS_KEY, SESSION_KEY]);
    return db;
}

async function generateAppliesCSV(){

}

async function deleteAllApplies(){
    const {applies} = await fetchAllEntities();


    if(applies.length){
        document.querySelector("#current-session-status").innerHTML = `All applies deleted, Start a session to begin`;

        await chrome.storage.sync.set({
            [APPLIES_KEY]: []
        });
    }else {
        document.querySelector("#current-session-status").innerHTML = `No applies found, Start a session to begin`;
    }

    
}

async function initSessionIfAvailable(){
    const {session} = await fetchAllEntities();

    document.querySelector("#current-session-status").innerHTML = `Session ID: ${session.id}`;

    document.querySelector("#start-session").parentNode.classList.add("is-hidden");
    document.querySelector("#resume-session").parentNode.classList.add("is-hidden");
    document.querySelector("#stop-session").parentNode.classList.remove("is-hidden");
}

async function startNewSession(){
    const {session, sessions} = await fetchAllEntities();

    const newSession = {
        id: self.crypto.randomUUID(),
        tags: [],
    }

    document.querySelector("#current-session-status").innerHTML = `Session ID: ${newSession.id}`;

    await chrome.storage.sync.set({
        [SESSIONS_KEY]: sessions&&sessions.length?sessions:[],
        [SESSION_KEY]: newSession
    });
}

async function stopSession(){
    const {session, sessions} = await fetchAllEntities();

    document.querySelector("#current-session-status").innerHTML = `Start a session to begin`;
    console.log(session, sessions)
    if(session) sessions.push(session);

    await chrome.storage.sync.set({
        [SESSIONS_KEY]: sessions,
        [SESSION_KEY]: null
    });
}

async function resumeLastSession(){
    let {session, sessions} = await fetchAllEntities();

    if(sessions && sessions.length){
        session = sessions.pop();
        document.querySelector("#current-session-status").innerHTML = `Session ID: ${session.id}`;
    }else {
        document.querySelector("#current-session-status").innerHTML = `No Session to restore, Start a session to begin`;
        sessions = [];
        session = null;
    }
    
    if(session) sessions.push(session);

    await chrome.storage.sync.set({
        [SESSIONS_KEY]: sessions,
        [SESSION_KEY]: session
    });
}


window.addEventListener('DOMContentLoaded', async function() {

    const doms = [
        {
            query: "#setting",
            url: "./settings/index.html"
        }
    ];
    for(dom of doms){
        const {url, query} = dom;
        document.querySelector(query).addEventListener("click", ()=>{
            chrome.tabs.create({url});
        });
    }

    const buttons = [
        {
            query: "#start-session",
            action: startNewSession
        },
        {
            query: "#stop-session",
            action: stopSession,
        },
        {
            query: "#resume-session",
            action: resumeLastSession
        },
        {
            query: "#save-applies-as-svg",
            action: generateAppliesCSV
        },
        {
            query: "#delete-all-applies",
            action: deleteAllApplies
        }
    ];

    for(button of buttons){
        const {query, action} = button;
        document.querySelector(query).addEventListener("click", ()=>{
            if( ["#start-session", "#resume-session", "#stop-session"].includes(query)){
                document.querySelector("#start-session").parentNode.classList.add("is-hidden");
                document.querySelector("#resume-session").parentNode.classList.add("is-hidden");
                document.querySelector("#stop-session").parentNode.classList.add("is-hidden");
                if(query == "#start-session") {
                    document.querySelector("#stop-session").parentNode.classList.remove("is-hidden");
                }else if (query == "#stop-session"){
                    document.querySelector("#start-session").parentNode.classList.remove("is-hidden");
                    document.querySelector("#resume-session").parentNode.classList.remove("is-hidden");
                }else if (query == "#resume-session"){
                    document.querySelector("#stop-session").parentNode.classList.remove("is-hidden");
                }
            }
            
            action();
        });
    }

    //Initing Session
    await initSessionIfAvailable();
    const {session} = await fetchAllEntities();

    function createTag(name, value){
        return `
        <div class="control">
            <div class="tags has-addons">
            <a class="tag is-dark"><abbr title="${value}">${name}</abbr></a>
            <a class="tag is-delete"></a>
            </div>
        </div>
        `
    }

    if(session && session.tags){
        document.querySelector("#tags").innerHTML = session.tags.map(st=>createTag(st.name, st.value)).join("");
    }else {
        document.querySelector("#tags").innerHTML = "No Tag Available"
    }

});