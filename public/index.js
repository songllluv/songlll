export function showDialog(type,msg){
    let Dialog = document.createElement("div");
    Dialog.id = "dialog";
    Dialog.innerHTML = `
<h1>${type}</h1>
<p>${msg}</p>
`;
    document.body.appendChild(Dialog);
    setTimeout(() => {
        Dialog.style.opacity = '0';
    }, 1500);
    setTimeout(() => {
        document.body.removeChild(Dialog);
    }, 2000);
}

var clickImg = new Event('clickImg');

document.addEventListener('click', function (e) {
    if (e.target.tagName === 'IMG' && e.target.alt !== 'Image Viewer') {
        let imgSrc = e.target.src;
        document.dispatchEvent(new CustomEvent('clickImg', { detail: imgSrc }));
    }
    else if( e.target.alt !== 'Image Viewer') {
        document.getElementById("img-viewer")?.remove();
    }
}, false);

function onClickimg() {
    document.addEventListener('clickImg', function (e) {
        let imgSrc = e.detail;
        showImgViewer(imgSrc);
    }, false);
}

onClickimg();

function showImgViewer(imgSrc) {
    let imgViewer = document.createElement("div");
    imgViewer.id = "img-viewer";
    imgViewer.innerHTML = `
<div class="img-container">
    <img src="${imgSrc}" alt="Image Viewer">
</div>
`;
    document.body.appendChild(imgViewer);
    imgOnLoad();
    resizeImage();
}

function resizeImage() {
    
    const viewer = document.getElementById("img-viewer");
    const imgContainer = viewer.querySelector(".img-container");
    const img = imgContainer.querySelector("img");
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const viewRatio = vw / vh;

    if (imgRatio > viewRatio) {
        // 图片更宽 → 宽度填满，按比例缩放高度
        img.style.width = vw + "px";
        img.style.height = "auto";
    } else {
        // 图片更高 → 高度填满，按比例缩放宽度
        img.style.height = vh + "px";
        img.style.width = "auto";
    }

    console.log(img.style.width, img.style.height);

    // 居中图片
    imgContainer.style.position = "fixed";
    imgContainer.style.top = "50%";
    imgContainer.style.left = "50%";
    imgContainer.style.transform = "translate(-50%, -50%)";
}

function imgOnLoad() {
    const viewer = document.getElementById("img-viewer");
    if (viewer) {
        const img = viewer.querySelector("img");
        img.onload = function() {
            resizeImage();
        };
    }
}

imgOnLoad();
window.addEventListener("resize", resizeImage);

// 添加自定义代码高亮style
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/${localStorage.getItem('codeTheme') || 'default'}.min.css`;
document.head.appendChild(link);