/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/url-join";
exports.ids = ["vendor-chunks/url-join"];
exports.modules = {

/***/ "(ssr)/./node_modules/url-join/lib/url-join.js":
/*!***********************************************!*\
  !*** ./node_modules/url-join/lib/url-join.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(name, context, definition) {\n    if ( true && module.exports) module.exports = definition();\n    else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),\n\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :\n\t\t__WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    else {}\n})(\"urljoin\", this, function() {\n    function normalize(strArray) {\n        var resultArray = [];\n        if (strArray.length === 0) {\n            return \"\";\n        }\n        if (typeof strArray[0] !== \"string\") {\n            throw new TypeError(\"Url must be a string. Received \" + strArray[0]);\n        }\n        // If the first part is a plain protocol, we combine it with the next part.\n        if (strArray[0].match(/^[^/:]+:\\/*$/) && strArray.length > 1) {\n            var first = strArray.shift();\n            strArray[0] = first + strArray[0];\n        }\n        // There must be two or three slashes in the file protocol, two slashes in anything else.\n        if (strArray[0].match(/^file:\\/\\/\\//)) {\n            strArray[0] = strArray[0].replace(/^([^/:]+):\\/*/, \"$1:///\");\n        } else {\n            strArray[0] = strArray[0].replace(/^([^/:]+):\\/*/, \"$1://\");\n        }\n        for(var i = 0; i < strArray.length; i++){\n            var component = strArray[i];\n            if (typeof component !== \"string\") {\n                throw new TypeError(\"Url must be a string. Received \" + component);\n            }\n            if (component === \"\") {\n                continue;\n            }\n            if (i > 0) {\n                // Removing the starting slashes for each component but the first.\n                component = component.replace(/^[\\/]+/, \"\");\n            }\n            if (i < strArray.length - 1) {\n                // Removing the ending slashes for each component but the last.\n                component = component.replace(/[\\/]+$/, \"\");\n            } else {\n                // For the last component we will combine multiple slashes to a single one.\n                component = component.replace(/[\\/]+$/, \"/\");\n            }\n            resultArray.push(component);\n        }\n        var str = resultArray.join(\"/\");\n        // Each input component is now separated by a single slash except the possible first plain protocol part.\n        // remove trailing slash before parameters or hash\n        str = str.replace(/\\/(\\?|&|#[^!])/g, \"$1\");\n        // replace ? in parameters with &\n        var parts = str.split(\"?\");\n        str = parts.shift() + (parts.length > 0 ? \"?\" : \"\") + parts.join(\"&\");\n        return str;\n    }\n    return function() {\n        var input;\n        if (typeof arguments[0] === \"object\") {\n            input = arguments[0];\n        } else {\n            input = [].slice.call(arguments);\n        }\n        return normalize(input);\n    };\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdXJsLWpvaW4vbGliL3VybC1qb2luLmpzIiwibWFwcGluZ3MiOiJBQUFDLDRFQUFVQSxJQUFJLEVBQUVDLE9BQU8sRUFBRUMsVUFBVTtJQUNsQyxJQUFJLEtBQWtCLElBQWVDLE9BQU9DLE9BQU8sRUFBRUQsT0FBT0MsT0FBTyxHQUFHRjtTQUNqRSxJQUFJLElBQTBDLEVBQUVHLG9DQUFPSCxVQUFVQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGtHQUFDQTtTQUNsRUQsRUFBNkJDO0FBQ3BDLEdBQUcsV0FBVyxJQUFJLEVBQUU7SUFFbEIsU0FBU0ssVUFBV0MsUUFBUTtRQUMxQixJQUFJQyxjQUFjLEVBQUU7UUFDcEIsSUFBSUQsU0FBU0UsTUFBTSxLQUFLLEdBQUc7WUFBRSxPQUFPO1FBQUk7UUFFeEMsSUFBSSxPQUFPRixRQUFRLENBQUMsRUFBRSxLQUFLLFVBQVU7WUFDbkMsTUFBTSxJQUFJRyxVQUFVLG9DQUFvQ0gsUUFBUSxDQUFDLEVBQUU7UUFDckU7UUFFQSwyRUFBMkU7UUFDM0UsSUFBSUEsUUFBUSxDQUFDLEVBQUUsQ0FBQ0ksS0FBSyxDQUFDLG1CQUFtQkosU0FBU0UsTUFBTSxHQUFHLEdBQUc7WUFDNUQsSUFBSUcsUUFBUUwsU0FBU00sS0FBSztZQUMxQk4sUUFBUSxDQUFDLEVBQUUsR0FBR0ssUUFBUUwsUUFBUSxDQUFDLEVBQUU7UUFDbkM7UUFFQSx5RkFBeUY7UUFDekYsSUFBSUEsUUFBUSxDQUFDLEVBQUUsQ0FBQ0ksS0FBSyxDQUFDLGlCQUFpQjtZQUNyQ0osUUFBUSxDQUFDLEVBQUUsR0FBR0EsUUFBUSxDQUFDLEVBQUUsQ0FBQ08sT0FBTyxDQUFDLGlCQUFpQjtRQUNyRCxPQUFPO1lBQ0xQLFFBQVEsQ0FBQyxFQUFFLEdBQUdBLFFBQVEsQ0FBQyxFQUFFLENBQUNPLE9BQU8sQ0FBQyxpQkFBaUI7UUFDckQ7UUFFQSxJQUFLLElBQUlDLElBQUksR0FBR0EsSUFBSVIsU0FBU0UsTUFBTSxFQUFFTSxJQUFLO1lBQ3hDLElBQUlDLFlBQVlULFFBQVEsQ0FBQ1EsRUFBRTtZQUUzQixJQUFJLE9BQU9DLGNBQWMsVUFBVTtnQkFDakMsTUFBTSxJQUFJTixVQUFVLG9DQUFvQ007WUFDMUQ7WUFFQSxJQUFJQSxjQUFjLElBQUk7Z0JBQUU7WUFBVTtZQUVsQyxJQUFJRCxJQUFJLEdBQUc7Z0JBQ1Qsa0VBQWtFO2dCQUNsRUMsWUFBWUEsVUFBVUYsT0FBTyxDQUFDLFVBQVU7WUFDMUM7WUFDQSxJQUFJQyxJQUFJUixTQUFTRSxNQUFNLEdBQUcsR0FBRztnQkFDM0IsK0RBQStEO2dCQUMvRE8sWUFBWUEsVUFBVUYsT0FBTyxDQUFDLFVBQVU7WUFDMUMsT0FBTztnQkFDTCwyRUFBMkU7Z0JBQzNFRSxZQUFZQSxVQUFVRixPQUFPLENBQUMsVUFBVTtZQUMxQztZQUVBTixZQUFZUyxJQUFJLENBQUNEO1FBRW5CO1FBRUEsSUFBSUUsTUFBTVYsWUFBWVcsSUFBSSxDQUFDO1FBQzNCLHlHQUF5RztRQUV6RyxrREFBa0Q7UUFDbERELE1BQU1BLElBQUlKLE9BQU8sQ0FBQyxtQkFBbUI7UUFFckMsaUNBQWlDO1FBQ2pDLElBQUlNLFFBQVFGLElBQUlHLEtBQUssQ0FBQztRQUN0QkgsTUFBTUUsTUFBTVAsS0FBSyxLQUFNTyxDQUFBQSxNQUFNWCxNQUFNLEdBQUcsSUFBSSxNQUFLLEVBQUMsSUFBS1csTUFBTUQsSUFBSSxDQUFDO1FBRWhFLE9BQU9EO0lBQ1Q7SUFFQSxPQUFPO1FBQ0wsSUFBSUk7UUFFSixJQUFJLE9BQU9DLFNBQVMsQ0FBQyxFQUFFLEtBQUssVUFBVTtZQUNwQ0QsUUFBUUMsU0FBUyxDQUFDLEVBQUU7UUFDdEIsT0FBTztZQUNMRCxRQUFRLEVBQUUsQ0FBQ0UsS0FBSyxDQUFDQyxJQUFJLENBQUNGO1FBQ3hCO1FBRUEsT0FBT2pCLFVBQVVnQjtJQUNuQjtBQUVGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmV0dGVyaGFjay8uL25vZGVfbW9kdWxlcy91cmwtam9pbi9saWIvdXJsLWpvaW4uanM/ODkxOSJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbik7XG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKTtcbn0pKCd1cmxqb2luJywgdGhpcywgZnVuY3Rpb24gKCkge1xuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZSAoc3RyQXJyYXkpIHtcbiAgICB2YXIgcmVzdWx0QXJyYXkgPSBbXTtcbiAgICBpZiAoc3RyQXJyYXkubGVuZ3RoID09PSAwKSB7IHJldHVybiAnJzsgfVxuXG4gICAgaWYgKHR5cGVvZiBzdHJBcnJheVswXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VybCBtdXN0IGJlIGEgc3RyaW5nLiBSZWNlaXZlZCAnICsgc3RyQXJyYXlbMF0pO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBmaXJzdCBwYXJ0IGlzIGEgcGxhaW4gcHJvdG9jb2wsIHdlIGNvbWJpbmUgaXQgd2l0aCB0aGUgbmV4dCBwYXJ0LlxuICAgIGlmIChzdHJBcnJheVswXS5tYXRjaCgvXlteLzpdKzpcXC8qJC8pICYmIHN0ckFycmF5Lmxlbmd0aCA+IDEpIHtcbiAgICAgIHZhciBmaXJzdCA9IHN0ckFycmF5LnNoaWZ0KCk7XG4gICAgICBzdHJBcnJheVswXSA9IGZpcnN0ICsgc3RyQXJyYXlbMF07XG4gICAgfVxuXG4gICAgLy8gVGhlcmUgbXVzdCBiZSB0d28gb3IgdGhyZWUgc2xhc2hlcyBpbiB0aGUgZmlsZSBwcm90b2NvbCwgdHdvIHNsYXNoZXMgaW4gYW55dGhpbmcgZWxzZS5cbiAgICBpZiAoc3RyQXJyYXlbMF0ubWF0Y2goL15maWxlOlxcL1xcL1xcLy8pKSB7XG4gICAgICBzdHJBcnJheVswXSA9IHN0ckFycmF5WzBdLnJlcGxhY2UoL14oW14vOl0rKTpcXC8qLywgJyQxOi8vLycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHJBcnJheVswXSA9IHN0ckFycmF5WzBdLnJlcGxhY2UoL14oW14vOl0rKTpcXC8qLywgJyQxOi8vJyk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IHN0ckFycmF5W2ldO1xuXG4gICAgICBpZiAodHlwZW9mIGNvbXBvbmVudCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVXJsIG11c3QgYmUgYSBzdHJpbmcuIFJlY2VpdmVkICcgKyBjb21wb25lbnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29tcG9uZW50ID09PSAnJykgeyBjb250aW51ZTsgfVxuXG4gICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgLy8gUmVtb3ZpbmcgdGhlIHN0YXJ0aW5nIHNsYXNoZXMgZm9yIGVhY2ggY29tcG9uZW50IGJ1dCB0aGUgZmlyc3QuXG4gICAgICAgIGNvbXBvbmVudCA9IGNvbXBvbmVudC5yZXBsYWNlKC9eW1xcL10rLywgJycpO1xuICAgICAgfVxuICAgICAgaWYgKGkgPCBzdHJBcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICAgIC8vIFJlbW92aW5nIHRoZSBlbmRpbmcgc2xhc2hlcyBmb3IgZWFjaCBjb21wb25lbnQgYnV0IHRoZSBsYXN0LlxuICAgICAgICBjb21wb25lbnQgPSBjb21wb25lbnQucmVwbGFjZSgvW1xcL10rJC8sICcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciB0aGUgbGFzdCBjb21wb25lbnQgd2Ugd2lsbCBjb21iaW5lIG11bHRpcGxlIHNsYXNoZXMgdG8gYSBzaW5nbGUgb25lLlxuICAgICAgICBjb21wb25lbnQgPSBjb21wb25lbnQucmVwbGFjZSgvW1xcL10rJC8sICcvJyk7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdEFycmF5LnB1c2goY29tcG9uZW50KTtcblxuICAgIH1cblxuICAgIHZhciBzdHIgPSByZXN1bHRBcnJheS5qb2luKCcvJyk7XG4gICAgLy8gRWFjaCBpbnB1dCBjb21wb25lbnQgaXMgbm93IHNlcGFyYXRlZCBieSBhIHNpbmdsZSBzbGFzaCBleGNlcHQgdGhlIHBvc3NpYmxlIGZpcnN0IHBsYWluIHByb3RvY29sIHBhcnQuXG5cbiAgICAvLyByZW1vdmUgdHJhaWxpbmcgc2xhc2ggYmVmb3JlIHBhcmFtZXRlcnMgb3IgaGFzaFxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXC8oXFw/fCZ8I1teIV0pL2csICckMScpO1xuXG4gICAgLy8gcmVwbGFjZSA/IGluIHBhcmFtZXRlcnMgd2l0aCAmXG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KCc/Jyk7XG4gICAgc3RyID0gcGFydHMuc2hpZnQoKSArIChwYXJ0cy5sZW5ndGggPiAwID8gJz8nOiAnJykgKyBwYXJ0cy5qb2luKCcmJyk7XG5cbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5wdXQ7XG5cbiAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlucHV0ID0gYXJndW1lbnRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnB1dCA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9ybWFsaXplKGlucHV0KTtcbiAgfTtcblxufSk7XG4iXSwibmFtZXMiOlsibmFtZSIsImNvbnRleHQiLCJkZWZpbml0aW9uIiwibW9kdWxlIiwiZXhwb3J0cyIsImRlZmluZSIsImFtZCIsIm5vcm1hbGl6ZSIsInN0ckFycmF5IiwicmVzdWx0QXJyYXkiLCJsZW5ndGgiLCJUeXBlRXJyb3IiLCJtYXRjaCIsImZpcnN0Iiwic2hpZnQiLCJyZXBsYWNlIiwiaSIsImNvbXBvbmVudCIsInB1c2giLCJzdHIiLCJqb2luIiwicGFydHMiLCJzcGxpdCIsImlucHV0IiwiYXJndW1lbnRzIiwic2xpY2UiLCJjYWxsIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/url-join/lib/url-join.js\n");

/***/ })

};
;