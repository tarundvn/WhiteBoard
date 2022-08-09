let optionsCont = document.querySelector(".options-cont");
let toolsCont = document.querySelector(".tools-cont");
let penciltoolCont = document.querySelector(".pencil-tool-cont");
let erasertoolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let pencilFlag = false;
let eraserFlag = false;
let optionsFlag = true;

optionsCont.addEventListener("click", (e) => {
  optionsFlag = !optionsFlag;
  if (optionsFlag) openTools();
  else closeTools();
});

function openTools() {
  let iconELement = optionsCont.children[0];
  iconELement.classList.remove("fa-times");
  iconELement.classList.add("fa-bars");
  toolsCont.style.display = "flex";
}

function closeTools() {
  let iconELement = optionsCont.children[0];
  iconELement.classList.remove("fa-bars");
  iconELement.classList.add("fa-times");
  toolsCont.style.display = "none";
  penciltoolCont.style.display = "none";
  erasertoolCont.style.display = "none";
}

pencil.addEventListener("click", function (e) {
  pencilFlag = !pencilFlag;
  if (pencilFlag) penciltoolCont.style.display = "block";
  else penciltoolCont.style.display = "none";
});

eraser.addEventListener("click", function (e) {
  eraserFlag = !eraserFlag;
  if (eraserFlag) erasertoolCont.style.display = "flex";
  else erasertoolCont.style.display = "none";
});

upload.addEventListener("click", (e) => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img class="image-input" src="${url}"/>
        </div>
        `;
        createSticky(stickyTemplateHTML);
    })
})

sticky.addEventListener("click", (e) => {
    let stickyTemplateHTML = `
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>
    `;
    createSticky(stickyTemplateHTML);
})

function createSticky(stickyTemplateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function (event) {
        dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
        return false;
    };
}

function noteActions(minimize, remove, stickyCont) {
  remove.addEventListener("click", function (e) {
    stickyCont.remove();
  });
  minimize.addEventListener("click", function (e) {
    let noteCont = stickyCont.querySelector(".note-cont");
    let display = getComputedStyle(noteCont).getPropertyValue("display");
    if (display === "none") {
      noteCont.style.display = "block";
    } else {
      noteCont.style.display = "none";
    }
  });
}

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}