    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode,
    )

    FilePond.setOptions({
        stylePanelAspectRatio: 150 / 100

    })
    FilePond.parse(document.body);

// const rootStyles = window.getComputedStyle(document.documentElement)

// if(rootStyles.getPropertyValue('--book-cover-width-large')!=null &&
//     rootStyles.getPropertyValue('--book-cover-width-large')!=''){
//     ready()
// }else{
//     document.getElementById('main-css').addEventListener('load', ready)
// }

// function ready(){
// const coverWidth =  parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'))
// const coveraspectratio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
// const coverHeight = parseFloat(coverWidth / coveraspectratio);


//     FilePond.registerPlugin(
//         FilePondPluginImagePreview,
//         FilePondPluginImageResize,
//         FilePondPluginFileEncode,
//     )
//     FilePond.setOptions({
//         stylePanelAspectRatio: 1 /  coveraspectratio,
//         imageResizeTargetWidth: coverWidth,
//         imageResizeTargetHeight: coverHeight
//     })
//     FilePond.parse(document.body);
// }

