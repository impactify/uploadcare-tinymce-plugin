/**
 * uploadcare-tinymce 4.0.2
 * File Uploader by Uploadcare, a plugin providing TinyMCE users to upload media via Uploadcare Widget.
 * https://github.com/uploadcare/uploadcare-tinymce#readme
 * Date: 2022-08-24
 */

(function () {
  'use strict';

  var icon = "\n<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0,0,256,256"
style="fill:#000000;">
<g fill="#517dff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M4,4c-1.09306,0 -2,0.90694 -2,2v12c0,1.09306 0.90694,2 2,2h8v-2h-8v-12h16v6h2v-6c0,-1.09306 -0.90694,-2 -2,-2zM14.5,11l-3.5,4l-2.5,-2.5l-2.72266,3.5h10.22266v-3zM18,14v4h-4v2h4v4h2v-4h4v-2h-4v-4z"></path></g></g>\n";

  /* global tinymce, uploadcare */

  var uploadcareDefaultOptions = {
    integration: getIntegration(),
    crop: "",
  };

  var plugin = function(editor) {
    if(!window.uploadcare) {
      tinymce.ScriptLoader.add(
        "https://ucarecdn.com/widget/" +
          "3.x" +
          "/uploadcare/uploadcare.full.min.js"
      );
      tinymce.ScriptLoader.loadQueue();
    }

    editor.options.register('uploadcare', {
      processor: 'object',
      default: {}
    });

    var uploadcareOptions = Object.assign({}, uploadcareDefaultOptions, editor.options.get('uploadcare'));

    function showUploadcareDialog() {
      var cdnBase = uploadcareOptions.cdnBase || uploadcare.defaults.cdnBase;
      var file = null;
      var selectedNode = editor.selection.getNode();

      if (selectedNode.nodeName === "IMG") {
        if (selectedNode.src.indexOf(cdnBase) === 0) {
          file = uploadcare.fileFrom(
            "uploaded",
            selectedNode.src,
            uploadcareOptions
          );
        }
      }
      if (selectedNode.nodeName === "A") {
        if (selectedNode.href.indexOf(cdnBase) === 0) {
          file = uploadcare.fileFrom(
            "uploaded",
            selectedNode.href,
            uploadcareOptions
          );
        }
      }

      uploadcare.openDialog(file, uploadcareOptions).done(function (file) {
        file.done(function (fileInfo) {
          if (fileInfo.isImage) {
            editor.selection.setNode(
              tinymce.activeEditor.dom.create("img", { src: fileInfo.cdnUrl })
            );
          } else if (selectedNode.nodeName === "A") {
            selectedNode.parentNode.replaceChild(
              tinymce.activeEditor.dom.create(
                "a",
                { href: fileInfo.cdnUrl },
                fileInfo.name
              ),
              selectedNode
            );
          } else {
            editor.selection.setNode(
              tinymce.activeEditor.dom.create(
                "a",
                { href: fileInfo.cdnUrl },
                fileInfo.name
              )
            );
          }
        });
      });
    }
    editor.ui.registry.addIcon("uploadcare", icon);

    editor.ui.registry.addButton("uploadcare", {
      text: "Insert media",
      tooltip: "Insert media",
      onAction: showUploadcareDialog,
      icon: "uploadcare",
    });

    return {
      getMetadata: function () {
        return {
          name: "Uploadcare Plugin",
          url: "https://github.com/uploadcare/uploadcare-tinymce/",
          version: "4.0.2",
        };
      },
    };
  };

  tinymce.PluginManager.add("uploadcare", plugin);

  function getIntegration() {
    var tinymceVersion = tinymce.majorVersion + "." + tinymce.minorVersion;
    var pluginVerion = "4.0.2";

    return "TinyMCE/{tinymceVersion}; Uploadcare-TinyMCE/{pluginVerion}"
      .replace("{tinymceVersion}", tinymceVersion)
      .replace("{pluginVerion}", pluginVerion);
  }

}());
