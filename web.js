document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(function (img) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function () {
            showImagePreview(img.src);
        });
    });

    function showImagePreview(src) {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = 0;
        overlay.style.top = 0;
        // overlay.style+="--spacing-md: 24px";
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.7)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = 9999;

        // 创建放大图片
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '90vw';
        img.style.maxHeight = '90vh';
        img.style.boxShadow = '0 0 20px #000';
        img.style.borderRadius = '8px';
        img.style.background = '#fff';

        // 点击遮罩层关闭预览
        overlay.addEventListener('click', function () {
            document.body.removeChild(overlay);
        });

        overlay.appendChild(img);
        document.body.appendChild(overlay);
    }
});