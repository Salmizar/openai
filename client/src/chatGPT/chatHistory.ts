
let storageName = "openai-chat";
function get():JSON {
    return JSON.parse(window.localStorage.getItem(storageName) || '[]');
}
function set(content: object) {
    window.localStorage.setItem(storageName, JSON.stringify(content));
}
function clear() {
    window.localStorage.removeItem(storageName);
}
function updateName(newName: string) {
    storageName = newName;
}

export { get, clear, set, updateName }