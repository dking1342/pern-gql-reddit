/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function() {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @chakra-ui/react */ \"@chakra-ui/react\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _urql_exchange_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @urql/exchange-auth */ \"@urql/exchange-auth\");\n/* harmony import */ var _urql_exchange_auth__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_urql_exchange_auth__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var urql__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! urql */ \"urql\");\n/* harmony import */ var urql__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(urql__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _urql_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @urql/core */ \"@urql/core\");\n/* harmony import */ var _urql_core__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_urql_core__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../theme */ \"./src/theme.tsx\");\n\nvar _jsxFileName = \"/Users/davidking/Coding/Practice/PERN/reddit/client/src/pages/_app.tsx\";\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\n\n\n\nconst client = (0,urql__WEBPACK_IMPORTED_MODULE_3__.createClient)({\n  url: 'http://localhost:4000/graphql',\n  exchanges: [urql__WEBPACK_IMPORTED_MODULE_3__.dedupExchange, urql__WEBPACK_IMPORTED_MODULE_3__.cacheExchange, (0,_urql_exchange_auth__WEBPACK_IMPORTED_MODULE_2__.authExchange)({\n    addAuthToOperation: ({\n      authState,\n      operation\n    }) => {\n      // the token isn't in the auth state, return the operation without changes\n      if (!authState) {\n        return operation;\n      }\n\n      let {\n        token\n      } = authState; // fetchOptions can be a function (See Client API) but you can simplify this based on usage\n\n      const fetchOptions = typeof operation.context.fetchOptions === 'function' ? operation.context.fetchOptions() : operation.context.fetchOptions || {};\n      return (0,_urql_core__WEBPACK_IMPORTED_MODULE_4__.makeOperation)(operation.kind, operation, _objectSpread(_objectSpread({}, operation.context), {}, {\n        fetchOptions: _objectSpread(_objectSpread({}, fetchOptions), {}, {\n          headers: _objectSpread(_objectSpread({}, fetchOptions.headers), {}, {\n            \"Authorization\": `Bearer ${token}`\n          })\n        })\n      }));\n    },\n    willAuthError: ({\n      authState\n    }) => {\n      if (!authState) return true; // e.g. check for expiration, existence of auth etc\n\n      return false;\n    },\n    didAuthError: ({\n      error\n    }) => {\n      // check if the error was an auth error (this can be implemented in various ways, e.g. 401 or a special error code)\n      return error.graphQLErrors.some(e => {\n        var _e$extensions;\n\n        return ((_e$extensions = e.extensions) === null || _e$extensions === void 0 ? void 0 : _e$extensions.code) === 'FORBIDDEN';\n      });\n    },\n    getAuth: async ({\n      authState\n    }) => {\n      // for initial launch, fetch the auth state from storage (local storage, async storage etc)\n      if (!authState) {\n        const isUser = localStorage.getItem('userInfo');\n\n        if (isUser) {\n          const {\n            token\n          } = JSON.parse(localStorage.getItem('userInfo'));\n          return {\n            token\n          };\n        }\n\n        return null;\n      } // your app logout logic should trigger here\n      // logout();\n\n\n      return null;\n    }\n  }), urql__WEBPACK_IMPORTED_MODULE_3__.fetchExchange]\n});\n\nfunction MyApp({\n  Component,\n  pageProps\n}) {\n  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(urql__WEBPACK_IMPORTED_MODULE_3__.Provider, {\n    value: client,\n    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ChakraProvider, {\n      resetCSS: true,\n      theme: _theme__WEBPACK_IMPORTED_MODULE_5__.default,\n      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ColorModeProvider, {\n        options: {\n          useSystemColorMode: true\n        },\n        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, _objectSpread({}, pageProps), void 0, false, {\n          fileName: _jsxFileName,\n          lineNumber: 89,\n          columnNumber: 11\n        }, this)\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 84,\n        columnNumber: 9\n      }, this)\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 83,\n      columnNumber: 7\n    }, this)\n  }, void 0, false, {\n    fileName: _jsxFileName,\n    lineNumber: 82,\n    columnNumber: 5\n  }, this);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MyApp);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvX2FwcC50c3g/ODU0OCJdLCJuYW1lcyI6WyJjbGllbnQiLCJjcmVhdGVDbGllbnQiLCJ1cmwiLCJleGNoYW5nZXMiLCJkZWR1cEV4Y2hhbmdlIiwiY2FjaGVFeGNoYW5nZSIsImF1dGhFeGNoYW5nZSIsImFkZEF1dGhUb09wZXJhdGlvbiIsImF1dGhTdGF0ZSIsIm9wZXJhdGlvbiIsInRva2VuIiwiZmV0Y2hPcHRpb25zIiwiY29udGV4dCIsIm1ha2VPcGVyYXRpb24iLCJraW5kIiwiaGVhZGVycyIsIndpbGxBdXRoRXJyb3IiLCJkaWRBdXRoRXJyb3IiLCJlcnJvciIsImdyYXBoUUxFcnJvcnMiLCJzb21lIiwiZSIsImV4dGVuc2lvbnMiLCJjb2RlIiwiZ2V0QXV0aCIsImlzVXNlciIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJmZXRjaEV4Y2hhbmdlIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJ0aGVtZSIsInVzZVN5c3RlbUNvbG9yTW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLE1BQU1BLE1BQU0sR0FBR0Msa0RBQVksQ0FBQztBQUMxQkMsS0FBRyxFQUFDLCtCQURzQjtBQUUxQkMsV0FBUyxFQUFFLENBQ1RDLCtDQURTLEVBRVRDLCtDQUZTLEVBR1RDLGlFQUFZLENBQUM7QUFDWEMsc0JBQWtCLEVBQUUsQ0FBQztBQUNuQkMsZUFEbUI7QUFFbkJDO0FBRm1CLEtBQUQsS0FHZDtBQUNKO0FBQ0EsVUFBSSxDQUFDRCxTQUFMLEVBQWdCO0FBQ2QsZUFBT0MsU0FBUDtBQUNEOztBQUNELFVBQUk7QUFBRUM7QUFBRixVQUFpQkYsU0FBckIsQ0FMSSxDQU9KOztBQUNBLFlBQU1HLFlBQVksR0FDaEIsT0FBT0YsU0FBUyxDQUFDRyxPQUFWLENBQWtCRCxZQUF6QixLQUEwQyxVQUExQyxHQUNJRixTQUFTLENBQUNHLE9BQVYsQ0FBa0JELFlBQWxCLEVBREosR0FFSUYsU0FBUyxDQUFDRyxPQUFWLENBQWtCRCxZQUFsQixJQUFrQyxFQUh4QztBQUtBLGFBQU9FLHlEQUFhLENBQ2xCSixTQUFTLENBQUNLLElBRFEsRUFFbEJMLFNBRmtCLGtDQUliQSxTQUFTLENBQUNHLE9BSkc7QUFLaEJELG9CQUFZLGtDQUNQQSxZQURPO0FBRVZJLGlCQUFPLGtDQUNGSixZQUFZLENBQUNJLE9BRFg7QUFFTCw2QkFBa0IsVUFBU0wsS0FBTTtBQUY1QjtBQUZHO0FBTEksU0FBcEI7QUFjRCxLQS9CVTtBQWdDWE0saUJBQWEsRUFBRSxDQUFDO0FBQUVSO0FBQUYsS0FBRCxLQUFtQjtBQUNoQyxVQUFJLENBQUNBLFNBQUwsRUFBZ0IsT0FBTyxJQUFQLENBRGdCLENBRWhDOztBQUNBLGFBQU8sS0FBUDtBQUNELEtBcENVO0FBcUNYUyxnQkFBWSxFQUFFLENBQUM7QUFBRUM7QUFBRixLQUFELEtBQWU7QUFDM0I7QUFDQSxhQUFPQSxLQUFLLENBQUNDLGFBQU4sQ0FBb0JDLElBQXBCLENBQ0xDLENBQUM7QUFBQTs7QUFBQSxlQUFJLGtCQUFBQSxDQUFDLENBQUNDLFVBQUYsZ0VBQWNDLElBQWQsTUFBdUIsV0FBM0I7QUFBQSxPQURJLENBQVA7QUFHRCxLQTFDVTtBQTJDWEMsV0FBTyxFQUFFLE9BQU87QUFBRWhCO0FBQUYsS0FBUCxLQUF5QjtBQUNoQztBQUNBLFVBQUksQ0FBQ0EsU0FBTCxFQUFnQjtBQUNkLGNBQU1pQixNQUFNLEdBQUdDLFlBQVksQ0FBQ0MsT0FBYixDQUFxQixVQUFyQixDQUFmOztBQUVBLFlBQUdGLE1BQUgsRUFBVTtBQUNSLGdCQUFNO0FBQUNmO0FBQUQsY0FBVWtCLElBQUksQ0FBQ0MsS0FBTCxDQUFXSCxZQUFZLENBQUNDLE9BQWIsQ0FBcUIsVUFBckIsQ0FBWCxDQUFoQjtBQUNBLGlCQUFPO0FBQ0xqQjtBQURLLFdBQVA7QUFHRDs7QUFDRCxlQUFPLElBQVA7QUFDRCxPQVorQixDQWNoQztBQUNBOzs7QUFFQSxhQUFPLElBQVA7QUFDRDtBQTdEVSxHQUFELENBSEgsRUFtRVRvQiwrQ0FuRVM7QUFGZSxDQUFELENBQTNCOztBQXlFQSxTQUFTQyxLQUFULENBQWU7QUFBRUMsV0FBRjtBQUFhQztBQUFiLENBQWYsRUFBNkM7QUFDM0Msc0JBQ0UsOERBQUMsMENBQUQ7QUFBVSxTQUFLLEVBQUVqQyxNQUFqQjtBQUFBLDJCQUNFLDhEQUFDLDREQUFEO0FBQWdCLGNBQVEsTUFBeEI7QUFBeUIsV0FBSyxFQUFFa0MsMkNBQWhDO0FBQUEsNkJBQ0UsOERBQUMsK0RBQUQ7QUFDRSxlQUFPLEVBQUU7QUFDUEMsNEJBQWtCLEVBQUU7QUFEYixTQURYO0FBQUEsK0JBS0UsOERBQUMsU0FBRCxvQkFBZUYsU0FBZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBREY7QUFhRDs7QUFFRCwrREFBZUYsS0FBZiIsImZpbGUiOiIuL3NyYy9wYWdlcy9fYXBwLnRzeC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYWtyYVByb3ZpZGVyLCBDb2xvck1vZGVQcm92aWRlciB9IGZyb20gJ0BjaGFrcmEtdWkvcmVhY3QnXG5pbXBvcnQgeyBhdXRoRXhjaGFuZ2UgfSBmcm9tICdAdXJxbC9leGNoYW5nZS1hdXRoJztcbmltcG9ydCB7IFByb3ZpZGVyLCBjcmVhdGVDbGllbnQsIGNhY2hlRXhjaGFuZ2UsIGRlZHVwRXhjaGFuZ2UsIGZldGNoRXhjaGFuZ2UgfSBmcm9tICd1cnFsJztcbmltcG9ydCB7IG1ha2VPcGVyYXRpb24gfSBmcm9tICdAdXJxbC9jb3JlJztcbmltcG9ydCB0aGVtZSBmcm9tICcuLi90aGVtZSc7XG5cbmNvbnN0IGNsaWVudCA9IGNyZWF0ZUNsaWVudCh7XG4gIHVybDonaHR0cDovL2xvY2FsaG9zdDo0MDAwL2dyYXBocWwnLFxuICBleGNoYW5nZXM6IFtcbiAgICBkZWR1cEV4Y2hhbmdlLFxuICAgIGNhY2hlRXhjaGFuZ2UsXG4gICAgYXV0aEV4Y2hhbmdlKHtcbiAgICAgIGFkZEF1dGhUb09wZXJhdGlvbjogKHtcbiAgICAgICAgYXV0aFN0YXRlLFxuICAgICAgICBvcGVyYXRpb24sXG4gICAgICB9KSA9PiB7XG4gICAgICAgIC8vIHRoZSB0b2tlbiBpc24ndCBpbiB0aGUgYXV0aCBzdGF0ZSwgcmV0dXJuIHRoZSBvcGVyYXRpb24gd2l0aG91dCBjaGFuZ2VzXG4gICAgICAgIGlmICghYXV0aFN0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuIG9wZXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeyB0b2tlbiB9OiBhbnkgPSBhdXRoU3RhdGU7XG5cbiAgICAgICAgLy8gZmV0Y2hPcHRpb25zIGNhbiBiZSBhIGZ1bmN0aW9uIChTZWUgQ2xpZW50IEFQSSkgYnV0IHlvdSBjYW4gc2ltcGxpZnkgdGhpcyBiYXNlZCBvbiB1c2FnZVxuICAgICAgICBjb25zdCBmZXRjaE9wdGlvbnMgPVxuICAgICAgICAgIHR5cGVvZiBvcGVyYXRpb24uY29udGV4dC5mZXRjaE9wdGlvbnMgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgID8gb3BlcmF0aW9uLmNvbnRleHQuZmV0Y2hPcHRpb25zKClcbiAgICAgICAgICAgIDogb3BlcmF0aW9uLmNvbnRleHQuZmV0Y2hPcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIHJldHVybiBtYWtlT3BlcmF0aW9uKFxuICAgICAgICAgIG9wZXJhdGlvbi5raW5kLFxuICAgICAgICAgIG9wZXJhdGlvbixcbiAgICAgICAgICB7XG4gICAgICAgICAgICAuLi5vcGVyYXRpb24uY29udGV4dCxcbiAgICAgICAgICAgIGZldGNoT3B0aW9uczoge1xuICAgICAgICAgICAgICAuLi5mZXRjaE9wdGlvbnMsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAuLi5mZXRjaE9wdGlvbnMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogYEJlYXJlciAke3Rva2VufWAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgd2lsbEF1dGhFcnJvcjogKHsgYXV0aFN0YXRlIH0pID0+IHtcbiAgICAgICAgaWYgKCFhdXRoU3RhdGUpIHJldHVybiB0cnVlO1xuICAgICAgICAvLyBlLmcuIGNoZWNrIGZvciBleHBpcmF0aW9uLCBleGlzdGVuY2Ugb2YgYXV0aCBldGNcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIGRpZEF1dGhFcnJvcjogKHsgZXJyb3IgfSkgPT4ge1xuICAgICAgICAvLyBjaGVjayBpZiB0aGUgZXJyb3Igd2FzIGFuIGF1dGggZXJyb3IgKHRoaXMgY2FuIGJlIGltcGxlbWVudGVkIGluIHZhcmlvdXMgd2F5cywgZS5nLiA0MDEgb3IgYSBzcGVjaWFsIGVycm9yIGNvZGUpXG4gICAgICAgIHJldHVybiBlcnJvci5ncmFwaFFMRXJyb3JzLnNvbWUoXG4gICAgICAgICAgZSA9PiBlLmV4dGVuc2lvbnM/LmNvZGUgPT09ICdGT1JCSURERU4nLFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIGdldEF1dGg6IGFzeW5jICh7IGF1dGhTdGF0ZSB9KSA9PiB7XG4gICAgICAgIC8vIGZvciBpbml0aWFsIGxhdW5jaCwgZmV0Y2ggdGhlIGF1dGggc3RhdGUgZnJvbSBzdG9yYWdlIChsb2NhbCBzdG9yYWdlLCBhc3luYyBzdG9yYWdlIGV0YylcbiAgICAgICAgaWYgKCFhdXRoU3RhdGUpIHtcbiAgICAgICAgICBjb25zdCBpc1VzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlckluZm8nKTtcblxuICAgICAgICAgIGlmKGlzVXNlcil7XG4gICAgICAgICAgICBjb25zdCB7dG9rZW59ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlckluZm8nKSEpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdG9rZW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB5b3VyIGFwcCBsb2dvdXQgbG9naWMgc2hvdWxkIHRyaWdnZXIgaGVyZVxuICAgICAgICAvLyBsb2dvdXQoKTtcblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0sXG5cbiAgICB9KSxcbiAgICBmZXRjaEV4Y2hhbmdlLFxuICBdLCAgXG59KTtcblxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OmFueSkge1xuICByZXR1cm4gKFxuICAgIDxQcm92aWRlciB2YWx1ZT17Y2xpZW50fT5cbiAgICAgIDxDaGFrcmFQcm92aWRlciByZXNldENTUyB0aGVtZT17dGhlbWV9PlxuICAgICAgICA8Q29sb3JNb2RlUHJvdmlkZXJcbiAgICAgICAgICBvcHRpb25zPXt7XG4gICAgICAgICAgICB1c2VTeXN0ZW1Db2xvck1vZGU6IHRydWUsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICAgICAgPC9Db2xvck1vZGVQcm92aWRlcj5cbiAgICAgIDwvQ2hha3JhUHJvdmlkZXI+XG4gICAgPC9Qcm92aWRlcj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBNeUFwcFxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/theme.tsx":
/*!***********************!*\
  !*** ./src/theme.tsx ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @chakra-ui/react */ \"@chakra-ui/react\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _chakra_ui_theme_tools__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @chakra-ui/theme-tools */ \"@chakra-ui/theme-tools\");\n/* harmony import */ var _chakra_ui_theme_tools__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_theme_tools__WEBPACK_IMPORTED_MODULE_2__);\n\nvar _jsxFileName = \"/Users/davidking/Coding/Practice/PERN/reddit/client/src/theme.tsx\";\n\n\nconst fonts = {\n  mono: `'Menlo', monospace`\n};\nconst breakpoints = (0,_chakra_ui_theme_tools__WEBPACK_IMPORTED_MODULE_2__.createBreakpoints)({\n  sm: '40em',\n  md: '52em',\n  lg: '64em',\n  xl: '80em'\n});\nconst theme = (0,_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.extendTheme)({\n  colors: {\n    black: '#16161D'\n  },\n  fonts,\n  breakpoints,\n  icons: {\n    logo: {\n      path: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"svg\", {\n        width: \"3000\",\n        height: \"3163\",\n        viewBox: \"0 0 3000 3163\",\n        fill: \"none\",\n        xmlns: \"http://www.w3.org/2000/svg\",\n        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"rect\", {\n          width: \"3000\",\n          height: \"3162.95\",\n          fill: \"none\"\n        }, void 0, false, {\n          fileName: _jsxFileName,\n          lineNumber: 29,\n          columnNumber: 11\n        }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"path\", {\n          d: \"M1470.89 1448.81L2170 2488.19H820V706.392H2170L1470.89 1448.81ZM1408.21 1515.37L909.196 2045.3V2393.46H1998.84L1408.21 1515.37Z\",\n          fill: \"currentColor\"\n        }, void 0, false, {\n          fileName: _jsxFileName,\n          lineNumber: 30,\n          columnNumber: 11\n        }, undefined)]\n      }, void 0, true, {\n        fileName: _jsxFileName,\n        lineNumber: 22,\n        columnNumber: 9\n      }, undefined),\n      viewBox: '0 0 3000 3163'\n    }\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (theme);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdGhlbWUudHN4P2NhNzYiXSwibmFtZXMiOlsiZm9udHMiLCJtb25vIiwiYnJlYWtwb2ludHMiLCJjcmVhdGVCcmVha3BvaW50cyIsInNtIiwibWQiLCJsZyIsInhsIiwidGhlbWUiLCJleHRlbmRUaGVtZSIsImNvbG9ycyIsImJsYWNrIiwiaWNvbnMiLCJsb2dvIiwicGF0aCIsInZpZXdCb3giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFFQSxNQUFNQSxLQUFLLEdBQUc7QUFBRUMsTUFBSSxFQUFHO0FBQVQsQ0FBZDtBQUVBLE1BQU1DLFdBQVcsR0FBR0MseUVBQWlCLENBQUM7QUFDcENDLElBQUUsRUFBRSxNQURnQztBQUVwQ0MsSUFBRSxFQUFFLE1BRmdDO0FBR3BDQyxJQUFFLEVBQUUsTUFIZ0M7QUFJcENDLElBQUUsRUFBRTtBQUpnQyxDQUFELENBQXJDO0FBT0EsTUFBTUMsS0FBSyxHQUFHQyw2REFBVyxDQUFDO0FBQ3hCQyxRQUFNLEVBQUU7QUFDTkMsU0FBSyxFQUFFO0FBREQsR0FEZ0I7QUFJeEJYLE9BSndCO0FBS3hCRSxhQUx3QjtBQU14QlUsT0FBSyxFQUFFO0FBQ0xDLFFBQUksRUFBRTtBQUNKQyxVQUFJLGVBQ0Y7QUFDRSxhQUFLLEVBQUMsTUFEUjtBQUVFLGNBQU0sRUFBQyxNQUZUO0FBR0UsZUFBTyxFQUFDLGVBSFY7QUFJRSxZQUFJLEVBQUMsTUFKUDtBQUtFLGFBQUssRUFBQyw0QkFMUjtBQUFBLGdDQU9FO0FBQU0sZUFBSyxFQUFDLE1BQVo7QUFBbUIsZ0JBQU0sRUFBQyxTQUExQjtBQUFvQyxjQUFJLEVBQUM7QUFBekM7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFQRixlQVFFO0FBQ0UsV0FBQyxFQUFDLGlJQURKO0FBRUUsY0FBSSxFQUFDO0FBRlA7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFSRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBRkU7QUFnQkpDLGFBQU8sRUFBRTtBQWhCTDtBQUREO0FBTmlCLENBQUQsQ0FBekI7QUE0QkEsK0RBQWVQLEtBQWYiLCJmaWxlIjoiLi9zcmMvdGhlbWUudHN4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXh0ZW5kVGhlbWUgfSBmcm9tICdAY2hha3JhLXVpL3JlYWN0J1xuaW1wb3J0IHsgY3JlYXRlQnJlYWtwb2ludHMgfSBmcm9tICdAY2hha3JhLXVpL3RoZW1lLXRvb2xzJ1xuXG5jb25zdCBmb250cyA9IHsgbW9ubzogYCdNZW5sbycsIG1vbm9zcGFjZWAgfVxuXG5jb25zdCBicmVha3BvaW50cyA9IGNyZWF0ZUJyZWFrcG9pbnRzKHtcbiAgc206ICc0MGVtJyxcbiAgbWQ6ICc1MmVtJyxcbiAgbGc6ICc2NGVtJyxcbiAgeGw6ICc4MGVtJyxcbn0pXG5cbmNvbnN0IHRoZW1lID0gZXh0ZW5kVGhlbWUoe1xuICBjb2xvcnM6IHtcbiAgICBibGFjazogJyMxNjE2MUQnLFxuICB9LFxuICBmb250cyxcbiAgYnJlYWtwb2ludHMsXG4gIGljb25zOiB7XG4gICAgbG9nbzoge1xuICAgICAgcGF0aDogKFxuICAgICAgICA8c3ZnXG4gICAgICAgICAgd2lkdGg9XCIzMDAwXCJcbiAgICAgICAgICBoZWlnaHQ9XCIzMTYzXCJcbiAgICAgICAgICB2aWV3Qm94PVwiMCAwIDMwMDAgMzE2M1wiXG4gICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICA+XG4gICAgICAgICAgPHJlY3Qgd2lkdGg9XCIzMDAwXCIgaGVpZ2h0PVwiMzE2Mi45NVwiIGZpbGw9XCJub25lXCIgLz5cbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZD1cIk0xNDcwLjg5IDE0NDguODFMMjE3MCAyNDg4LjE5SDgyMFY3MDYuMzkySDIxNzBMMTQ3MC44OSAxNDQ4LjgxWk0xNDA4LjIxIDE1MTUuMzdMOTA5LjE5NiAyMDQ1LjNWMjM5My40NkgxOTk4Ljg0TDE0MDguMjEgMTUxNS4zN1pcIlxuICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICApLFxuICAgICAgdmlld0JveDogJzAgMCAzMDAwIDMxNjMnLFxuICAgIH0sXG4gIH0sXG59KVxuXG5leHBvcnQgZGVmYXVsdCB0aGVtZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/theme.tsx\n");

/***/ }),

/***/ "@chakra-ui/react":
/*!***********************************!*\
  !*** external "@chakra-ui/react" ***!
  \***********************************/
/***/ (function(module) {

"use strict";
module.exports = require("@chakra-ui/react");;

/***/ }),

/***/ "@chakra-ui/theme-tools":
/*!*****************************************!*\
  !*** external "@chakra-ui/theme-tools" ***!
  \*****************************************/
/***/ (function(module) {

"use strict";
module.exports = require("@chakra-ui/theme-tools");;

/***/ }),

/***/ "@urql/core":
/*!*****************************!*\
  !*** external "@urql/core" ***!
  \*****************************/
/***/ (function(module) {

"use strict";
module.exports = require("@urql/core");;

/***/ }),

/***/ "@urql/exchange-auth":
/*!**************************************!*\
  !*** external "@urql/exchange-auth" ***!
  \**************************************/
/***/ (function(module) {

"use strict";
module.exports = require("@urql/exchange-auth");;

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ (function(module) {

"use strict";
module.exports = require("react/jsx-dev-runtime");;

/***/ }),

/***/ "urql":
/*!***********************!*\
  !*** external "urql" ***!
  \***********************/
/***/ (function(module) {

"use strict";
module.exports = require("urql");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();