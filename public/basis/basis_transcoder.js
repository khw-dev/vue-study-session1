const BASIS = (() => {
  let _scriptName = typeof document == 'undefined' ? undefined : document.currentScript?.src
  if (typeof __filename != 'undefined') {
    _scriptName ||= __filename
  }
  return (
    function (moduleArg = {}) {
      let moduleRtn

      const Module = moduleArg; let readyPromiseResolve, readyPromiseReject; const readyPromise = new Promise((resolve, reject) => {
        readyPromiseResolve = resolve; readyPromiseReject = reject
      }); const ENVIRONMENT_IS_WEB = typeof window == 'object'; const ENVIRONMENT_IS_WORKER = typeof importScripts == 'function'; const ENVIRONMENT_IS_NODE = typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string'; if (ENVIRONMENT_IS_NODE) {} let moduleOverrides = Object.assign({}, Module); let arguments_ = []; let thisProgram = './this.program'; let quit_ = (status, toThrow) => {
        throw toThrow
      }; let scriptDirectory = ''; function locateFile (path) {
        if (Module['locateFile']) {
          return Module['locateFile'](path, scriptDirectory)
        } return scriptDirectory + path
      } let readAsync, readBinary; if (ENVIRONMENT_IS_NODE) {
        const fs = require('node:fs'); const nodePath = require('node:path'); scriptDirectory = __dirname + '/'; readBinary = filename => {
          filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename); const ret = fs.readFileSync(filename); return ret
        }; readAsync = (filename, binary = true) => {
          filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename); return new Promise((resolve, reject) => {
            fs.readFile(filename, binary ? undefined : 'utf8', (err, data) => {
              if (err) {
                reject(err)
              } else {
                resolve(binary ? data.buffer : data)
              }
            })
          })
        }; if (!Module['thisProgram'] && process.argv.length > 1) {
          thisProgram = process.argv[1].replace(/\\/g, '/')
        }arguments_ = process.argv.slice(2); quit_ = (status, toThrow) => {
          process.exitCode = status; throw toThrow
        }
      } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = self.location.href
        } else if (typeof document != 'undefined' && document.currentScript) {
          scriptDirectory = document.currentScript.src
        } if (_scriptName) {
          scriptDirectory = _scriptName
        } scriptDirectory = scriptDirectory.startsWith('blob:') ? '' : scriptDirectory.slice(0, Math.max(0, scriptDirectory.replace(/[?#].*/, '').lastIndexOf('/') + 1)); { if (ENVIRONMENT_IS_WORKER) {
          readBinary = url => {
            const xhr = new XMLHttpRequest(); xhr.open('GET', url, false); xhr.responseType = 'arraybuffer'; xhr.send(null); return new Uint8Array(xhr.response)
          }
        }readAsync = url => {
          if (isFileURI(url)) {
            return new Promise((reject, resolve) => {
              const xhr = new XMLHttpRequest(); xhr.open('GET', url, true); xhr.responseType = 'arraybuffer'; xhr.addEventListener('load', () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                  resolve(xhr.response)
                }reject(xhr.status)
              }); xhr.onerror = reject; xhr.send(null)
            })
          } return fetch(url, { credentials: 'same-origin' }).then(response => {
            if (response.ok) {
              return response.arrayBuffer()
            } throw new Error(response.status + ' : ' + response.url)
          })
        } }
      } else {} const out = Module['print'] || console.log.bind(console); const err = Module['printErr'] || console.error.bind(console); Object.assign(Module, moduleOverrides); moduleOverrides = null; if (Module['arguments']) {
        arguments_ = Module['arguments']
      } if (Module['thisProgram']) {
        thisProgram = Module['thisProgram']
      } if (Module['quit']) {
        quit_ = Module['quit']
      } let wasmBinary; if (Module['wasmBinary']) {
        wasmBinary = Module['wasmBinary']
      } let wasmMemory; let ABORT = false; let EXITSTATUS; let HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64; function updateMemoryViews () {
        const b = wasmMemory.buffer; Module['HEAP8'] = HEAP8 = new Int8Array(b); Module['HEAP16'] = HEAP16 = new Int16Array(b); Module['HEAPU8'] = HEAPU8 = new Uint8Array(b); Module['HEAPU16'] = HEAPU16 = new Uint16Array(b); Module['HEAP32'] = HEAP32 = new Int32Array(b); Module['HEAPU32'] = HEAPU32 = new Uint32Array(b); Module['HEAPF32'] = HEAPF32 = new Float32Array(b); Module['HEAPF64'] = HEAPF64 = new Float64Array(b)
      } const __ATPRERUN__ = []; const __ATINIT__ = []; const __ATPOSTRUN__ = []; let runtimeInitialized = false; function preRun () {
        if (Module['preRun']) {
          if (typeof Module['preRun'] == 'function') {
            Module['preRun'] = [Module['preRun']]
          } while (Module['preRun'].length > 0) {
            addOnPreRun(Module['preRun'].shift())
          }
        }callRuntimeCallbacks(__ATPRERUN__)
      } function initRuntime () {
        runtimeInitialized = true; callRuntimeCallbacks(__ATINIT__)
      } function postRun () {
        if (Module['postRun']) {
          if (typeof Module['postRun'] == 'function') {
            Module['postRun'] = [Module['postRun']]
          } while (Module['postRun'].length > 0) {
            addOnPostRun(Module['postRun'].shift())
          }
        }callRuntimeCallbacks(__ATPOSTRUN__)
      } function addOnPreRun (cb) {
        __ATPRERUN__.unshift(cb)
      } function addOnInit (cb) {
        __ATINIT__.unshift(cb)
      } function addOnPostRun (cb) {
        __ATPOSTRUN__.unshift(cb)
      } let runDependencies = 0; let runDependencyWatcher = null; let dependenciesFulfilled = null; function addRunDependency (id) {
        runDependencies++; Module['monitorRunDependencies']?.(runDependencies)
      } function removeRunDependency (id) {
        runDependencies--; Module['monitorRunDependencies']?.(runDependencies); if (runDependencies == 0) {
          if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher); runDependencyWatcher = null
          } if (dependenciesFulfilled) {
            const callback = dependenciesFulfilled; dependenciesFulfilled = null; callback()
          }
        }
      } function abort (what) {
        Module['onAbort']?.(what); what = 'Aborted(' + what + ')'; err(what); ABORT = true; EXITSTATUS = 1; what += '. Build with -sASSERTIONS for more info.'; const e = new WebAssembly.RuntimeError(what); readyPromiseReject(e); throw e
      } const dataURIPrefix = 'data:application/octet-stream;base64,'; const isDataURI = filename => filename.startsWith(dataURIPrefix); var isFileURI = filename => filename.startsWith('file://'); function findWasmBinary () {
        const f = 'basis_transcoder.wasm'; if (!isDataURI(f)) {
          return locateFile(f)
        } return f
      } let wasmBinaryFile; function getBinarySync (file) {
        if (file == wasmBinaryFile && wasmBinary) {
          return new Uint8Array(wasmBinary)
        } if (readBinary) {
          return readBinary(file)
        } throw 'both async and sync fetching of the wasm failed'
      } function getBinaryPromise (binaryFile) {
        if (!wasmBinary) {
          return readAsync(binaryFile).then(response => new Uint8Array(response), () => getBinarySync(binaryFile))
        } return Promise.resolve().then(() => getBinarySync(binaryFile))
      } function instantiateArrayBuffer (binaryFile, imports, receiver) {
        return getBinaryPromise(binaryFile).then(binary => WebAssembly.instantiate(binary, imports)).then(receiver, error => {
          err(`failed to asynchronously prepare wasm: ${error}`); abort(error)
        })
      } function instantiateAsync (binary, binaryFile, imports, callback) {
        if (!binary && typeof WebAssembly.instantiateStreaming == 'function' && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == 'function') {
          return fetch(binaryFile, { credentials: 'same-origin' }).then(response => {
            const result = WebAssembly.instantiateStreaming(response, imports); return result.then(callback, function (error) {
              err(`wasm streaming compile failed: ${error}`); err('falling back to ArrayBuffer instantiation'); return instantiateArrayBuffer(binaryFile, imports, callback)
            })
          })
        } return instantiateArrayBuffer(binaryFile, imports, callback)
      } function getWasmImports () {
        return { a: wasmImports }
      } function createWasm () {
        const info = getWasmImports(); function receiveInstance (instance, module) {
          wasmExports = instance.exports; wasmMemory = wasmExports['L']; updateMemoryViews(); wasmTable = wasmExports['P']; addOnInit(wasmExports['M']); removeRunDependency('wasm-instantiate'); return wasmExports
        }addRunDependency('wasm-instantiate'); function receiveInstantiationResult (result) {
          receiveInstance(result['instance'])
        } if (Module['instantiateWasm']) {
          try {
            return Module['instantiateWasm'](info, receiveInstance)
          } catch (error) {
            err(`Module.instantiateWasm callback failed with error: ${error}`); readyPromiseReject(error)
          }
        } if (!wasmBinaryFile) {
          wasmBinaryFile = findWasmBinary()
        }instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject); return {}
      } var callRuntimeCallbacks = callbacks => {
        while (callbacks.length > 0) {
          callbacks.shift()(Module)
        }
      }; const noExitRuntime = Module['noExitRuntime'] || true; class ExceptionInfo {
        constructor (excPtr) {
          this.excPtr = excPtr; this.ptr = excPtr - 24
        }

        set_type (type) {
          HEAPU32[this.ptr + 4 >> 2] = type
        }

        get_type () {
          return HEAPU32[this.ptr + 4 >> 2]
        }

        set_destructor (destructor) {
          HEAPU32[this.ptr + 8 >> 2] = destructor
        }

        get_destructor () {
          return HEAPU32[this.ptr + 8 >> 2]
        }

        set_caught (caught) {
          caught = caught ? 1 : 0; HEAP8[this.ptr + 12] = caught
        }

        get_caught () {
          return HEAP8[this.ptr + 12] != 0
        }

        set_rethrown (rethrown) {
          rethrown = rethrown ? 1 : 0; HEAP8[this.ptr + 13] = rethrown
        }

        get_rethrown () {
          return HEAP8[this.ptr + 13] != 0
        }

        init (type, destructor) {
          this.set_adjusted_ptr(0); this.set_type(type); this.set_destructor(destructor)
        }

        set_adjusted_ptr (adjustedPtr) {
          HEAPU32[this.ptr + 16 >> 2] = adjustedPtr
        }

        get_adjusted_ptr () {
          return HEAPU32[this.ptr + 16 >> 2]
        }

        get_exception_ptr () {
          const isPointer = ___cxa_is_pointer_type(this.get_type()); if (isPointer) {
            return HEAPU32[this.excPtr >> 2]
          } const adjusted = this.get_adjusted_ptr(); if (adjusted !== 0) {
            return adjusted
          } return this.excPtr
        }
      } let exceptionLast = 0; let uncaughtExceptionCount = 0; const ___cxa_throw = (ptr, type, destructor) => {
        const info = new ExceptionInfo(ptr); info.init(type, destructor); exceptionLast = ptr; uncaughtExceptionCount++; throw exceptionLast
      }; const __abort_js = () => {
        abort('')
      }; const structRegistrations = {}; const runDestructors = destructors => {
        while (destructors.length > 0) {
          const ptr = destructors.pop(); const del = destructors.pop(); del(ptr)
        }
      }; function readPointer (pointer) {
        return this['fromWireType'](HEAPU32[pointer >> 2])
      } const awaitingDependencies = {}; const registeredTypes = {}; const typeDependencies = {}; let InternalError; const throwInternalError = message => {
        throw new InternalError(message)
      }; const whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
        for (const type of myTypes) {
          typeDependencies[type] = dependentTypes
        } function onComplete (typeConverters) {
          const myTypeConverters = getTypeConverters(typeConverters); if (myTypeConverters.length !== myTypes.length) {
            throwInternalError('Mismatched type converter count')
          } for (const [i, myType] of myTypes.entries()) {
            registerType(myType, myTypeConverters[i])
          }
        } const typeConverters = Array.from({ length: dependentTypes.length }); const unregisteredTypes = []; let registered = 0; for (const [i, dt] of dependentTypes.entries()) {
          if (registeredTypes.hasOwnProperty(dt)) {
            typeConverters[i] = registeredTypes[dt]
          } else {
            unregisteredTypes.push(dt); if (!awaitingDependencies.hasOwnProperty(dt)) {
              awaitingDependencies[dt] = []
            }awaitingDependencies[dt].push(() => {
              typeConverters[i] = registeredTypes[dt]; ++registered; if (registered === unregisteredTypes.length) {
                onComplete(typeConverters)
              }
            })
          }
        } if (unregisteredTypes.length === 0) {
          onComplete(typeConverters)
        }
      }; const __embind_finalize_value_object = structType => {
        const reg = structRegistrations[structType]; delete structRegistrations[structType]; const rawConstructor = reg.rawConstructor; const rawDestructor = reg.rawDestructor; const fieldRecords = reg.fields; const fieldTypes = fieldRecords.map(field => field.getterReturnType).concat(fieldRecords.map(field => field.setterArgumentType)); whenDependentTypesAreResolved([structType], fieldTypes, fieldTypes => {
          const fields = {}; for (const [i, field] of fieldRecords.entries()) {
            const fieldName = field.fieldName; var getterReturnType = fieldTypes[i]; var getter = field.getter; var getterContext = field.getterContext; var setterArgumentType = fieldTypes[i + fieldRecords.length]; var setter = field.setter; var setterContext = field.setterContext; fields[fieldName] = { read: ptr => getterReturnType['fromWireType'](getter(getterContext, ptr)), write: (ptr, o) => {
              const destructors = []; setter(setterContext, ptr, setterArgumentType['toWireType'](destructors, o)); runDestructors(destructors)
            } }
          } return [{ name: reg.name, fromWireType: ptr => {
            const rv = {}; for (const i in fields) {
              rv[i] = fields[i].read(ptr)
            }rawDestructor(ptr); return rv
          }, toWireType: (destructors, o) => {
            for (var fieldName in fields) {
              if (!(fieldName in o)) {
                throw new TypeError(`Missing field: "${fieldName}"`)
              }
            } const ptr = rawConstructor(); for (fieldName in fields) {
              fields[fieldName].write(ptr, o[fieldName])
            } if (destructors !== null) {
              destructors.push(rawDestructor, ptr)
            } return ptr
          }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction: rawDestructor }]
        })
      }; const __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => {}; const embind_init_charCodes = () => {
        const codes = Array.from({ length: 256 }); for (let i = 0; i < 256; ++i) {
          codes[i] = String.fromCharCode(i)
        }embind_charCodes = codes
      }; let embind_charCodes; const readLatin1String = ptr => {
        let ret = ''; let c = ptr; while (HEAPU8[c]) {
          ret += embind_charCodes[HEAPU8[c++]]
        } return ret
      }; let BindingError; const throwBindingError = message => {
        throw new BindingError(message)
      }; function sharedRegisterType (rawType, registeredInstance, options = {}) {
        const name = registeredInstance.name; if (!rawType) {
          throwBindingError(`type "${name}" must have a positive integer typeid pointer`)
        } if (registeredTypes.hasOwnProperty(rawType)) {
          if (options.ignoreDuplicateRegistrations) {
            return
          } else {
            throwBindingError(`Cannot register type '${name}' twice`)
          }
        }registeredTypes[rawType] = registeredInstance; delete typeDependencies[rawType]; if (awaitingDependencies.hasOwnProperty(rawType)) {
          const callbacks = awaitingDependencies[rawType]; delete awaitingDependencies[rawType]; for (const cb of callbacks) {
            cb()
          }
        }
      } function registerType (rawType, registeredInstance, options = {}) {
        if (!('argPackAdvance' in registeredInstance)) {
          throw new TypeError('registerType registeredInstance requires argPackAdvance')
        } return sharedRegisterType(rawType, registeredInstance, options)
      } var GenericWireTypeSize = 8; const __embind_register_bool = (rawType, name, trueValue, falseValue) => {
        name = readLatin1String(name); registerType(rawType, { name, fromWireType (wt) {
          return !!wt
        }, toWireType (destructors, o) {
          return o ? trueValue : falseValue
        }, argPackAdvance: GenericWireTypeSize, readValueFromPointer (pointer) {
          return this['fromWireType'](HEAPU8[pointer])
        }, destructorFunction: null })
      }; const shallowCopyInternalPointer = o => ({ count: o.count, deleteScheduled: o.deleteScheduled, preservePointerOnDelete: o.preservePointerOnDelete, ptr: o.ptr, ptrType: o.ptrType, smartPtr: o.smartPtr, smartPtrType: o.smartPtrType }); const throwInstanceAlreadyDeleted = obj => {
        function getInstanceTypeName (handle) {
          return handle.$$.ptrType.registeredClass.name
        }throwBindingError(getInstanceTypeName(obj) + ' instance already deleted')
      }; let finalizationRegistry = false; let detachFinalizer = handle => {}; const runDestructor = $$ => {
        if ($$.smartPtr) {
          $$.smartPtrType.rawDestructor($$.smartPtr)
        } else {
          $$.ptrType.registeredClass.rawDestructor($$.ptr)
        }
      }; const releaseClassHandle = $$ => {
        $$.count.value -= 1; const toDelete = 0 === $$.count.value; if (toDelete) {
          runDestructor($$)
        }
      }; const downcastPointer = (ptr, ptrClass, desiredClass) => {
        if (ptrClass === desiredClass) {
          return ptr
        } if (undefined === desiredClass.baseClass) {
          return null
        } const rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass); if (rv === null) {
          return null
        } return desiredClass.downcast(rv)
      }; const registeredPointers = {}; const getInheritedInstanceCount = () => Object.keys(registeredInstances).length; const getLiveInheritedInstances = () => {
        const rv = []; for (const k in registeredInstances) {
          if (registeredInstances.hasOwnProperty(k)) {
            rv.push(registeredInstances[k])
          }
        } return rv
      }; const deletionQueue = []; const flushPendingDeletes = () => {
        while (deletionQueue.length > 0) {
          const obj = deletionQueue.pop(); obj.$$.deleteScheduled = false; obj['delete']()
        }
      }; let delayFunction; const setDelayFunction = fn => {
        delayFunction = fn; if (deletionQueue.length > 0 && delayFunction) {
          delayFunction(flushPendingDeletes)
        }
      }; const init_embind = () => {
        Module['getInheritedInstanceCount'] = getInheritedInstanceCount; Module['getLiveInheritedInstances'] = getLiveInheritedInstances; Module['flushPendingDeletes'] = flushPendingDeletes; Module['setDelayFunction'] = setDelayFunction
      }; var registeredInstances = {}; const getBasestPointer = (class_, ptr) => {
        if (ptr === undefined) {
          throwBindingError('ptr should not be undefined')
        } while (class_.baseClass) {
          ptr = class_.upcast(ptr); class_ = class_.baseClass
        } return ptr
      }; const getInheritedInstance = (class_, ptr) => {
        ptr = getBasestPointer(class_, ptr); return registeredInstances[ptr]
      }; const makeClassHandle = (prototype, record) => {
        if (!record.ptrType || !record.ptr) {
          throwInternalError('makeClassHandle requires ptr and ptrType')
        } const hasSmartPtrType = !!record.smartPtrType; const hasSmartPtr = !!record.smartPtr; if (hasSmartPtrType !== hasSmartPtr) {
          throwInternalError('Both smartPtrType and smartPtr must be specified')
        }record.count = { value: 1 }; return attachFinalizer(Object.create(prototype, { $$: { value: record, writable: true } }))
      }; function RegisteredPointer_fromWireType (ptr) {
        const rawPointer = this.getPointee(ptr); if (!rawPointer) {
          this.destructor(ptr); return null
        } const registeredInstance = getInheritedInstance(this.registeredClass, rawPointer); if (undefined !== registeredInstance) {
          if (0 === registeredInstance.$$.count.value) {
            registeredInstance.$$.ptr = rawPointer; registeredInstance.$$.smartPtr = ptr; return registeredInstance['clone']()
          } else {
            const rv = registeredInstance['clone'](); this.destructor(ptr); return rv
          }
        } function makeDefaultHandle () {
          return this.isSmartPointer ? makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: rawPointer, smartPtrType: this, smartPtr: ptr }) : makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this, ptr })
        } const actualType = this.registeredClass.getActualType(rawPointer); const registeredPointerRecord = registeredPointers[actualType]; if (!registeredPointerRecord) {
          return makeDefaultHandle.call(this)
        } let toType; toType = this.isConst ? registeredPointerRecord.constPointerType : registeredPointerRecord.pointerType; const dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass); if (dp === null) {
          return makeDefaultHandle.call(this)
        } return this.isSmartPointer ? makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp, smartPtrType: this, smartPtr: ptr }) : makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp })
      } var attachFinalizer = handle => {
        if ('undefined' === typeof FinalizationRegistry) {
          attachFinalizer = handle => handle; return handle
        }finalizationRegistry = new FinalizationRegistry(info => {
          releaseClassHandle(info.$$)
        }); attachFinalizer = handle => {
          const $$ = handle.$$; const hasSmartPtr = !!$$.smartPtr; if (hasSmartPtr) {
            const info = { $$ }; finalizationRegistry.register(handle, info, handle)
          } return handle
        }; detachFinalizer = handle => finalizationRegistry.unregister(handle); return attachFinalizer(handle)
      }; const init_ClassHandle = () => {
        Object.assign(ClassHandle.prototype, { isAliasOf (other) {
          if (!(this instanceof ClassHandle)) {
            return false
          } if (!(other instanceof ClassHandle)) {
            return false
          } let leftClass = this.$$.ptrType.registeredClass; let left = this.$$.ptr; other.$$ = other.$$; let rightClass = other.$$.ptrType.registeredClass; let right = other.$$.ptr; while (leftClass.baseClass) {
            left = leftClass.upcast(left); leftClass = leftClass.baseClass
          } while (rightClass.baseClass) {
            right = rightClass.upcast(right); rightClass = rightClass.baseClass
          } return leftClass === rightClass && left === right
        }, clone () {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this)
          } if (this.$$.preservePointerOnDelete) {
            this.$$.count.value += 1; return this
          } else {
            const clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), { $$: { value: shallowCopyInternalPointer(this.$$) } })); clone.$$.count.value += 1; clone.$$.deleteScheduled = false; return clone
          }
        }, delete () {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this)
          } if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
            throwBindingError('Object already scheduled for deletion')
          }detachFinalizer(this); releaseClassHandle(this.$$); if (!this.$$.preservePointerOnDelete) {
            this.$$.smartPtr = undefined; this.$$.ptr = undefined
          }
        }, isDeleted () {
          return !this.$$.ptr
        }, deleteLater () {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this)
          } if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
            throwBindingError('Object already scheduled for deletion')
          }deletionQueue.push(this); if (deletionQueue.length === 1 && delayFunction) {
            delayFunction(flushPendingDeletes)
          } this.$$.deleteScheduled = true; return this
        } })
      }; function ClassHandle () {} const createNamedFunction = (name, body) => Object.defineProperty(body, 'name', { value: name }); const ensureOverloadTable = (proto, methodName, humanName) => {
        if (undefined === proto[methodName].overloadTable) {
          const prevFunc = proto[methodName]; proto[methodName] = function (...args) {
            if (!proto[methodName].overloadTable.hasOwnProperty(args.length)) {
              throwBindingError(`Function '${humanName}' called with an invalid number of arguments (${args.length}) - expects one of (${proto[methodName].overloadTable})!`)
            } return proto[methodName].overloadTable[args.length].apply(this, args)
          }; proto[methodName].overloadTable = []; proto[methodName].overloadTable[prevFunc.argCount] = prevFunc
        }
      }; const exposePublicSymbol = (name, value, numArguments) => {
        if (Module.hasOwnProperty(name)) {
          if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) {
            throwBindingError(`Cannot register public name '${name}' twice`)
          }ensureOverloadTable(Module, name, name); if (Module.hasOwnProperty(numArguments)) {
            throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`)
          }Module[name].overloadTable[numArguments] = value
        } else {
          Module[name] = value; if (undefined !== numArguments) {
            Module[name].numArguments = numArguments
          }
        }
      }; const char_0 = 48; const char_9 = 57; const makeLegalFunctionName = name => {
        if (undefined === name) {
          return '_unknown'
        }name = name.replace(/[^a-zA-Z0-9_]/g, '$'); const f = name.charCodeAt(0); if (f >= char_0 && f <= char_9) {
          return `_${name}`
        } return name
      }; function RegisteredClass (name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
        this.name = name; this.constructor = constructor; this.instancePrototype = instancePrototype; this.rawDestructor = rawDestructor; this.baseClass = baseClass; this.getActualType = getActualType; this.upcast = upcast; this.downcast = downcast; this.pureVirtualFunctions = []
      } const upcastPointer = (ptr, ptrClass, desiredClass) => {
        while (ptrClass !== desiredClass) {
          if (!ptrClass.upcast) {
            throwBindingError(`Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`)
          }ptr = ptrClass.upcast(ptr); ptrClass = ptrClass.baseClass
        } return ptr
      }; function constNoSmartPtrRawPointerToWireType (destructors, handle) {
        if (handle === null) {
          if (this.isReference) {
            throwBindingError(`null is not a valid ${this.name}`)
          } return 0
        } if (!handle.$$) {
          throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`)
        } if (!handle.$$.ptr) {
          throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`)
        } const handleClass = handle.$$.ptrType.registeredClass; const ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass); return ptr
      } function genericPointerToWireType (destructors, handle) {
        let ptr; if (handle === null) {
          if (this.isReference) {
            throwBindingError(`null is not a valid ${this.name}`)
          } if (this.isSmartPointer) {
            ptr = this.rawConstructor(); if (destructors !== null) {
              destructors.push(this.rawDestructor, ptr)
            } return ptr
          } else {
            return 0
          }
        } if (!handle || !handle.$$) {
          throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`)
        } if (!handle.$$.ptr) {
          throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`)
        } if (!this.isConst && handle.$$.ptrType.isConst) {
          throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`)
        } const handleClass = handle.$$.ptrType.registeredClass; ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass); if (this.isSmartPointer) {
          if (undefined === handle.$$.smartPtr) {
            throwBindingError('Passing raw pointer to smart pointer is illegal')
          } switch (this.sharingPolicy) {
            case 0: { if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr
            } else {
              throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`)
            } break
            } case 1: { ptr = handle.$$.smartPtr; break
            } case 2: { if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr
            } else {
              const clonedHandle = handle['clone'](); ptr = this.rawShare(ptr, Emval.toHandle(() => clonedHandle['delete']())); if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr)
              }
            } break
            } default: { throwBindingError('Unsupporting sharing policy')
            }
          }
        } return ptr
      } function nonConstNoSmartPtrRawPointerToWireType (destructors, handle) {
        if (handle === null) {
          if (this.isReference) {
            throwBindingError(`null is not a valid ${this.name}`)
          } return 0
        } if (!handle.$$) {
          throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`)
        } if (!handle.$$.ptr) {
          throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`)
        } if (handle.$$.ptrType.isConst) {
          throwBindingError(`Cannot convert argument of type ${handle.$$.ptrType.name} to parameter type ${this.name}`)
        } const handleClass = handle.$$.ptrType.registeredClass; const ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass); return ptr
      } const init_RegisteredPointer = () => {
        Object.assign(RegisteredPointer.prototype, { getPointee (ptr) {
          if (this.rawGetPointee) {
            ptr = this.rawGetPointee(ptr)
          } return ptr
        }, destructor (ptr) {
          this.rawDestructor?.(ptr)
        }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, fromWireType: RegisteredPointer_fromWireType })
      }; function RegisteredPointer (name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
        this.name = name; this.registeredClass = registeredClass; this.isReference = isReference; this.isConst = isConst; this.isSmartPointer = isSmartPointer; this.pointeeType = pointeeType; this.sharingPolicy = sharingPolicy; this.rawGetPointee = rawGetPointee; this.rawConstructor = rawConstructor; this.rawShare = rawShare; this.rawDestructor = rawDestructor; if (!isSmartPointer && registeredClass.baseClass === undefined) {
          if (isConst) {
            this['toWireType'] = constNoSmartPtrRawPointerToWireType; this.destructorFunction = null
          } else {
            this['toWireType'] = nonConstNoSmartPtrRawPointerToWireType; this.destructorFunction = null
          }
        } else {
          this['toWireType'] = genericPointerToWireType
        }
      } const replacePublicSymbol = (name, value, numArguments) => {
        if (!Module.hasOwnProperty(name)) {
          throwInternalError('Replacing nonexistent public symbol')
        } if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
          Module[name].overloadTable[numArguments] = value
        } else {
          Module[name] = value; Module[name].argCount = numArguments
        }
      }; const dynCallLegacy = (sig, ptr, args) => {
        sig = sig.replace(/p/g, 'i'); const f = Module['dynCall_' + sig]; return f(ptr, ...args)
      }; const wasmTableMirror = []; let wasmTable; const getWasmTableEntry = funcPtr => {
        let func = wasmTableMirror[funcPtr]; if (!func) {
          if (funcPtr >= wasmTableMirror.length) {
            wasmTableMirror.length = funcPtr + 1
          }wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr)
        } return func
      }; const dynCall = (sig, ptr, args = []) => {
        if (sig.includes('j')) {
          return dynCallLegacy(sig, ptr, args)
        } const rtn = getWasmTableEntry(ptr)(...args); return rtn
      }; const getDynCaller = (sig, ptr) => (...args) => dynCall(sig, ptr, args); const embind__requireFunction = (signature, rawFunction) => {
        signature = readLatin1String(signature); function makeDynCaller () {
          if (signature.includes('j')) {
            return getDynCaller(signature, rawFunction)
          } return getWasmTableEntry(rawFunction)
        } const fp = makeDynCaller(); if (typeof fp != 'function') {
          throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`)
        } return fp
      }; const extendError = (baseErrorType, errorName) => {
        const errorClass = createNamedFunction(errorName, function (message) {
          this.name = errorName; this.message = message; const stack = new Error(message).stack; if (stack !== undefined) {
            this.stack = this.toString() + '\n' + stack.replace(/^Error(:[^\n]*)?\n/, '')
          }
        }); errorClass.prototype = Object.create(baseErrorType.prototype); errorClass.prototype.constructor = errorClass; errorClass.prototype.toString = function () {
          return this.message === undefined ? this.name : `${this.name}: ${this.message}`
        }; return errorClass
      }; let UnboundTypeError; const getTypeName = type => {
        const ptr = ___getTypeName(type); const rv = readLatin1String(ptr); _free(ptr); return rv
      }; const throwUnboundTypeError = (message, types) => {
        const unboundTypes = []; const seen = {}; function visit (type) {
          if (seen[type]) {
            return
          } if (registeredTypes[type]) {
            return
          } if (typeDependencies[type]) {
            typeDependencies[type].forEach(visit); return
          }unboundTypes.push(type); seen[type] = true
        }types.forEach(visit); throw new UnboundTypeError(`${message}: ` + unboundTypes.map(getTypeName).join([', ']))
      }; const __embind_register_class = (rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) => {
        name = readLatin1String(name); getActualType = embind__requireFunction(getActualTypeSignature, getActualType); upcast &&= embind__requireFunction(upcastSignature, upcast); downcast &&= embind__requireFunction(downcastSignature, downcast); rawDestructor = embind__requireFunction(destructorSignature, rawDestructor); const legalFunctionName = makeLegalFunctionName(name); exposePublicSymbol(legalFunctionName, function () {
          throwUnboundTypeError(`Cannot construct ${name} due to unbound types`, [baseClassRawType])
        }); whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], base => {
          base = base[0]; let baseClass; let basePrototype; if (baseClassRawType) {
            baseClass = base.registeredClass; basePrototype = baseClass.instancePrototype
          } else {
            basePrototype = ClassHandle.prototype
          } const constructor = createNamedFunction(name, function (...args) {
            if (Object.getPrototypeOf(this) !== instancePrototype) {
              throw new BindingError('Use \'new\' to construct ' + name)
            } if (undefined === registeredClass.constructor_body) {
              throw new BindingError(name + ' has no accessible constructor')
            } const body = registeredClass.constructor_body[args.length]; if (undefined === body) {
              throw new BindingError(`Tried to invoke ctor of ${name} with invalid number of parameters (${args.length}) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`)
            } return body.apply(this, args)
          }); var instancePrototype = Object.create(basePrototype, { constructor: { value: constructor } }); constructor.prototype = instancePrototype; var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast); if (registeredClass.baseClass) {
            registeredClass.baseClass.__derivedClasses ??= []; registeredClass.baseClass.__derivedClasses.push(registeredClass)
          } const referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false); const pointerConverter = new RegisteredPointer(name + '*', registeredClass, false, false, false); const constPointerConverter = new RegisteredPointer(name + ' const*', registeredClass, false, true, false); registeredPointers[rawType] = { pointerType: pointerConverter, constPointerType: constPointerConverter }; replacePublicSymbol(legalFunctionName, constructor); return [referenceConverter, pointerConverter, constPointerConverter]
        })
      }; const heap32VectorToArray = (count, firstElement) => {
        const array = []; for (let i = 0; i < count; i++) {
          array.push(HEAPU32[firstElement + i * 4 >> 2])
        } return array
      }; function usesDestructorStack (argTypes) {
        for (let i = 1; i < argTypes.length; ++i) {
          if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
            return true
          }
        } return false
      } function newFunc (constructor, argumentList) {
        if (!(typeof constructor === 'function')) {
          throw new TypeError(`new_ called with constructor type ${typeof constructor} which is not a function`)
        } const dummy = createNamedFunction(constructor.name || 'unknownFunctionName', function () {}); dummy.prototype = constructor.prototype; const obj = new dummy(); const r = constructor.apply(obj, argumentList); return r instanceof Object ? r : obj
      } function createJsInvoker (argTypes, isClassMethodFunc, returns, isAsync) {
        const needsDestructorStack = usesDestructorStack(argTypes); const argCount = argTypes.length; let argsList = ''; let argsListWired = ''; for (var i = 0; i < argCount - 2; ++i) {
          argsList += (i === 0 ? '' : ', ') + 'arg' + i; argsListWired += (i === 0 ? '' : ', ') + 'arg' + i + 'Wired'
        } let invokerFnBody = `\n        return function (${argsList}) {\n        if (arguments.length !== ${argCount - 2}) {\n          throwBindingError('function ' + humanName + ' called with ' + arguments.length + ' arguments, expected ${argCount - 2}');\n        }`; if (needsDestructorStack) {
          invokerFnBody += 'var destructors = [];\n'
        } const dtorStack = needsDestructorStack ? 'destructors' : 'null'; const args1 = ['humanName', 'throwBindingError', 'invoker', 'fn', 'runDestructors', 'retType', 'classParam']; if (isClassMethodFunc) {
          invokerFnBody += 'var thisWired = classParam[\'toWireType\'](' + dtorStack + ', this);\n'
        } for (var i = 0; i < argCount - 2; ++i) {
          invokerFnBody += 'var arg' + i + 'Wired = argType' + i + '[\'toWireType\'](' + dtorStack + ', arg' + i + ');\n'; args1.push('argType' + i)
        } if (isClassMethodFunc) {
          argsListWired = 'thisWired' + (argsListWired.length > 0 ? ', ' : '') + argsListWired
        }invokerFnBody += (returns || isAsync ? 'var rv = ' : '') + 'invoker(fn' + (argsListWired.length > 0 ? ', ' : '') + argsListWired + ');\n'; if (needsDestructorStack) {
          invokerFnBody += 'runDestructors(destructors);\n'
        } else {
          for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
            const paramName = i === 1 ? 'thisWired' : 'arg' + (i - 2) + 'Wired'; if (argTypes[i].destructorFunction !== null) {
              invokerFnBody += `${paramName}_dtor(${paramName});\n`; args1.push(`${paramName}_dtor`)
            }
          }
        } if (returns) {
          invokerFnBody += 'var ret = retType[\'fromWireType\'](rv);\n' + 'return ret;\n'
        } else {}invokerFnBody += '}\n'; return [args1, invokerFnBody]
      } function craftInvokerFunction (humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, isAsync) {
        const argCount = argTypes.length; if (argCount < 2) {
          throwBindingError('argTypes array size mismatch! Must at least get return value and \'this\' types!')
        } const isClassMethodFunc = argTypes[1] !== null && classType !== null; const needsDestructorStack = usesDestructorStack(argTypes); const returns = argTypes[0].name !== 'void'; const closureArgs = [humanName, throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]]; for (var i = 0; i < argCount - 2; ++i) {
          closureArgs.push(argTypes[i + 2])
        } if (!needsDestructorStack) {
          for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
            if (argTypes[i].destructorFunction !== null) {
              closureArgs.push(argTypes[i].destructorFunction)
            }
          }
        } const [args, invokerFnBody] = createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync); args.push(invokerFnBody); const invokerFn = newFunc(Function, args)(...closureArgs); return createNamedFunction(humanName, invokerFn)
      } const __embind_register_class_constructor = (rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) => {
        const rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr); invoker = embind__requireFunction(invokerSignature, invoker); whenDependentTypesAreResolved([], [rawClassType], classType => {
          classType = classType[0]; const humanName = `constructor ${classType.name}`; if (undefined === classType.registeredClass.constructor_body) {
            classType.registeredClass.constructor_body = []
          } if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
            throw new BindingError(`Cannot register multiple constructors with identical number of parameters (${argCount - 1}) for class '${classType.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`)
          }classType.registeredClass.constructor_body[argCount - 1] = () => {
            throwUnboundTypeError(`Cannot construct ${classType.name} due to unbound types`, rawArgTypes)
          }; whenDependentTypesAreResolved([], rawArgTypes, argTypes => {
            argTypes.splice(1, 0, null); classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor); return []
          }); return []
        })
      }; const getFunctionName = signature => {
        signature = signature.trim(); const argsIndex = signature.indexOf('('); return argsIndex === -1 ? signature : signature.slice(0, Math.max(0, argsIndex))
      }; const __embind_register_class_function = (rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual, isAsync) => {
        const rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr); methodName = readLatin1String(methodName); methodName = getFunctionName(methodName); rawInvoker = embind__requireFunction(invokerSignature, rawInvoker); whenDependentTypesAreResolved([], [rawClassType], classType => {
          classType = classType[0]; const humanName = `${classType.name}.${methodName}`; if (methodName.startsWith('@@')) {
            methodName = Symbol[methodName.slice(2)]
          } if (isPureVirtual) {
            classType.registeredClass.pureVirtualFunctions.push(methodName)
          } function unboundTypesHandler () {
            throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`, rawArgTypes)
          } const proto = classType.registeredClass.instancePrototype; const method = proto[methodName]; if (undefined === method || undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
            unboundTypesHandler.argCount = argCount - 2; unboundTypesHandler.className = classType.name; proto[methodName] = unboundTypesHandler
          } else {
            ensureOverloadTable(proto, methodName, humanName); proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler
          }whenDependentTypesAreResolved([], rawArgTypes, argTypes => {
            const memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context, isAsync); if (undefined === proto[methodName].overloadTable) {
              memberFunction.argCount = argCount - 2; proto[methodName] = memberFunction
            } else {
              proto[methodName].overloadTable[argCount - 2] = memberFunction
            } return []
          }); return []
        })
      }; const __embind_register_constant = (name, type, value) => {
        name = readLatin1String(name); whenDependentTypesAreResolved([], [type], type => {
          type = type[0]; Module[name] = type['fromWireType'](value); return []
        })
      }; const emval_freelist = []; const emval_handles = []; const __emval_decref = handle => {
        if (handle > 9 && 0 === --emval_handles[handle + 1]) {
          emval_handles[handle] = undefined; emval_freelist.push(handle)
        }
      }; const count_emval_handles = () => emval_handles.length / 2 - 5 - emval_freelist.length; const init_emval = () => {
        emval_handles.push(0, 1, undefined, 1, null, 1, true, 1, false, 1); Module['count_emval_handles'] = count_emval_handles
      }; var Emval = { toValue: handle => {
        if (!handle) {
          throwBindingError('Cannot use deleted val. handle = ' + handle)
        } return emval_handles[handle]
      }, toHandle: value => {
        switch (value) {
          case undefined: { return 2
          } case null: { return 4
          } case true: { return 6
          } case false: { return 8
          } default:{ const handle = emval_freelist.pop() || emval_handles.length; emval_handles[handle] = value; emval_handles[handle + 1] = 1; return handle }
        }
      } }; const EmValType = { name: 'emscripten::val', fromWireType: handle => {
        const rv = Emval.toValue(handle); __emval_decref(handle); return rv
      }, toWireType: (destructors, value) => Emval.toHandle(value), argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction: null }; const __embind_register_emval = rawType => registerType(rawType, EmValType); const enumReadValueFromPointer = (name, width, signed) => {
        switch (width) {
          case 1: { return signed
            ? function (pointer) {
              return this['fromWireType'](HEAP8[pointer])
            }
            : function (pointer) {
              return this['fromWireType'](HEAPU8[pointer])
            }
          } case 2: { return signed
            ? function (pointer) {
              return this['fromWireType'](HEAP16[pointer >> 1])
            }
            : function (pointer) {
              return this['fromWireType'](HEAPU16[pointer >> 1])
            }
          } case 4: { return signed
            ? function (pointer) {
              return this['fromWireType'](HEAP32[pointer >> 2])
            }
            : function (pointer) {
              return this['fromWireType'](HEAPU32[pointer >> 2])
            }
          } default: { throw new TypeError(`invalid integer width (${width}): ${name}`)
          }
        }
      }; const __embind_register_enum = (rawType, name, size, isSigned) => {
        name = readLatin1String(name); function ctor () {}ctor.values = {}; registerType(rawType, { name, constructor: ctor, fromWireType (c) {
          return this.constructor.values[c]
        }, toWireType: (destructors, c) => c.value, argPackAdvance: GenericWireTypeSize, readValueFromPointer: enumReadValueFromPointer(name, size, isSigned), destructorFunction: null }); exposePublicSymbol(name, ctor)
      }; const requireRegisteredType = (rawType, humanName) => {
        const impl = registeredTypes[rawType]; if (undefined === impl) {
          throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`)
        } return impl
      }; const __embind_register_enum_value = (rawEnumType, name, enumValue) => {
        const enumType = requireRegisteredType(rawEnumType, 'enum'); name = readLatin1String(name); const Enum = enumType.constructor; const Value = Object.create(enumType.constructor.prototype, { value: { value: enumValue }, constructor: { value: createNamedFunction(`${enumType.name}_${name}`, function () {}) } }); Enum.values[enumValue] = Value; Enum[name] = Value
      }; var embindRepr = v => {
        if (v === null) {
          return 'null'
        } const t = typeof v; return t === 'object' || t === 'array' || t === 'function' ? v.toString() : '' + v
      }; const floatReadValueFromPointer = (name, width) => {
        switch (width) {
          case 4: { return function (pointer) {
            return this['fromWireType'](HEAPF32[pointer >> 2])
          }
          } case 8: { return function (pointer) {
            return this['fromWireType'](HEAPF64[pointer >> 3])
          }
          } default: { throw new TypeError(`invalid float width (${width}): ${name}`)
          }
        }
      }; const __embind_register_float = (rawType, name, size) => {
        name = readLatin1String(name); registerType(rawType, { name, fromWireType: value => value, toWireType: (destructors, value) => value, argPackAdvance: GenericWireTypeSize, readValueFromPointer: floatReadValueFromPointer(name, size), destructorFunction: null })
      }; const __embind_register_function = (name, argCount, rawArgTypesAddr, signature, rawInvoker, fn, isAsync) => {
        const argTypes = heap32VectorToArray(argCount, rawArgTypesAddr); name = readLatin1String(name); name = getFunctionName(name); rawInvoker = embind__requireFunction(signature, rawInvoker); exposePublicSymbol(name, function () {
          throwUnboundTypeError(`Cannot call ${name} due to unbound types`, argTypes)
        }, argCount - 1); whenDependentTypesAreResolved([], argTypes, argTypes => {
          const invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1)); replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn, isAsync), argCount - 1); return []
        })
      }; const integerReadValueFromPointer = (name, width, signed) => {
        switch (width) {
          case 1: { return signed ? pointer => HEAP8[pointer] : pointer => HEAPU8[pointer]
          } case 2: { return signed ? pointer => HEAP16[pointer >> 1] : pointer => HEAPU16[pointer >> 1]
          } case 4: { return signed ? pointer => HEAP32[pointer >> 2] : pointer => HEAPU32[pointer >> 2]
          } default: { throw new TypeError(`invalid integer width (${width}): ${name}`)
          }
        }
      }; const __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => {
        name = readLatin1String(name); if (maxRange === -1) {
          maxRange = 4_294_967_295
        } let fromWireType = value => value; if (minRange === 0) {
          const bitshift = 32 - 8 * size; fromWireType = value => value << bitshift >>> bitshift
        } const isUnsignedType = name.includes('unsigned'); const checkAssertions = (value, toTypeName) => {}; let toWireType; toWireType = isUnsignedType
          ? function (destructors, value) {
            checkAssertions(value, this.name); return value >>> 0
          }
          : function (destructors, value) {
            checkAssertions(value, this.name); return value
          }; registerType(primitiveType, { name, fromWireType, toWireType, argPackAdvance: GenericWireTypeSize, readValueFromPointer: integerReadValueFromPointer(name, size, minRange !== 0), destructorFunction: null })
      }; const __embind_register_memory_view = (rawType, dataTypeIndex, name) => {
        const typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array]; const TA = typeMapping[dataTypeIndex]; function decodeMemoryView (handle) {
          const size = HEAPU32[handle >> 2]; const data = HEAPU32[handle + 4 >> 2]; return new TA(HEAP8.buffer, data, size)
        }name = readLatin1String(name); registerType(rawType, { name, fromWireType: decodeMemoryView, argPackAdvance: GenericWireTypeSize, readValueFromPointer: decodeMemoryView }, { ignoreDuplicateRegistrations: true })
      }; const stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
        if (!(maxBytesToWrite > 0)) {
          return 0
        } const startIdx = outIdx; const endIdx = outIdx + maxBytesToWrite - 1; for (let i = 0; i < str.length; ++i) {
          let u = str.charCodeAt(i); if (u >= 55_296 && u <= 57_343) {
            const u1 = str.charCodeAt(++i); u = 65_536 + ((u & 1023) << 10) | u1 & 1023
          } if (u <= 127) {
            if (outIdx >= endIdx) {
              break
            } heap[outIdx++] = u
          } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) {
              break
            } heap[outIdx++] = 192 | u >> 6; heap[outIdx++] = 128 | u & 63
          } else if (u <= 65_535) {
            if (outIdx + 2 >= endIdx) {
              break
            } heap[outIdx++] = 224 | u >> 12; heap[outIdx++] = 128 | u >> 6 & 63; heap[outIdx++] = 128 | u & 63
          } else {
            if (outIdx + 3 >= endIdx) {
              break
            } heap[outIdx++] = 240 | u >> 18; heap[outIdx++] = 128 | u >> 12 & 63; heap[outIdx++] = 128 | u >> 6 & 63; heap[outIdx++] = 128 | u & 63
          }
        }heap[outIdx] = 0; return outIdx - startIdx
      }; const stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite); const lengthBytesUTF8 = str => {
        let len = 0; for (let i = 0; i < str.length; ++i) {
          const c = str.charCodeAt(i); if (c <= 127) {
            len++
          } else if (c <= 2047) {
            len += 2
          } else if (c >= 55_296 && c <= 57_343) {
            len += 4; ++i
          } else {
            len += 3
          }
        } return len
      }; const UTF8Decoder = typeof TextDecoder == 'undefined' ? undefined : new TextDecoder(); const UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
        const endIdx = idx + maxBytesToRead; let endPtr = idx; while (heapOrArray[endPtr] && !(endPtr >= endIdx)) {
          ++endPtr
        } if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
          return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr))
        } let str = ''; while (idx < endPtr) {
          let u0 = heapOrArray[idx++]; if (!(u0 & 128)) {
            str += String.fromCharCode(u0); continue
          } const u1 = heapOrArray[idx++] & 63; if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1); continue
          } const u2 = heapOrArray[idx++] & 63; u0 = (u0 & 240) == 224 ? (u0 & 15) << 12 | u1 << 6 | u2 : (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63; if (u0 < 65_536) {
            str += String.fromCharCode(u0)
          } else {
            const ch = u0 - 65_536; str += String.fromCharCode(55_296 | ch >> 10, 56_320 | ch & 1023)
          }
        } return str
      }; const UTF8ToString = (ptr, maxBytesToRead) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ''; const __embind_register_std_string = (rawType, name) => {
        name = readLatin1String(name); const stdStringIsUTF8 = name === 'std::string'; registerType(rawType, { name, fromWireType (value) {
          const length = HEAPU32[value >> 2]; const payload = value + 4; let str; if (stdStringIsUTF8) {
            let decodeStartPtr = payload; for (var i = 0; i <= length; ++i) {
              const currentBytePtr = payload + i; if (i == length || HEAPU8[currentBytePtr] == 0) {
                const maxRead = currentBytePtr - decodeStartPtr; const stringSegment = UTF8ToString(decodeStartPtr, maxRead); if (str === undefined) {
                  str = stringSegment
                } else {
                  str += String.fromCharCode(0); str += stringSegment
                }decodeStartPtr = currentBytePtr + 1
              }
            }
          } else {
            const a = new Array(length); for (var i = 0; i < length; ++i) {
              a[i] = String.fromCharCode(HEAPU8[payload + i])
            }str = a.join('')
          }_free(value); return str
        }, toWireType (destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value)
          } let length; const valueIsOfTypeString = typeof value == 'string'; if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
            throwBindingError('Cannot pass non-string to std::string')
          } length = stdStringIsUTF8 && valueIsOfTypeString ? lengthBytesUTF8(value) : value.length; const base = _malloc(4 + length + 1); const ptr = base + 4; HEAPU32[base >> 2] = length; if (stdStringIsUTF8 && valueIsOfTypeString) {
            stringToUTF8(value, ptr, length + 1)
          } else {
            if (valueIsOfTypeString) {
              for (var i = 0; i < length; ++i) {
                const charCode = value.charCodeAt(i); if (charCode > 255) {
                  _free(ptr); throwBindingError('String has UTF-16 code units that do not fit in 8 bits')
                }HEAPU8[ptr + i] = charCode
              }
            } else {
              for (var i = 0; i < length; ++i) {
                HEAPU8[ptr + i] = value[i]
              }
            }
          } if (destructors !== null) {
            destructors.push(_free, base)
          } return base
        }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction (ptr) {
          _free(ptr)
        } })
      }; const UTF16Decoder = typeof TextDecoder == 'undefined' ? undefined : new TextDecoder('utf-16le'); const UTF16ToString = (ptr, maxBytesToRead) => {
        let endPtr = ptr; let idx = endPtr >> 1; const maxIdx = idx + maxBytesToRead / 2; while (!(idx >= maxIdx) && HEAPU16[idx]) {
          ++idx
        }endPtr = idx << 1; if (endPtr - ptr > 32 && UTF16Decoder) {
          return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr))
        } let str = ''; for (let i = 0; !(i >= maxBytesToRead / 2); ++i) {
          const codeUnit = HEAP16[ptr + i * 2 >> 1]; if (codeUnit == 0) {
            break
          } str += String.fromCharCode(codeUnit)
        } return str
      }; const stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
        maxBytesToWrite ??= 2_147_483_647; if (maxBytesToWrite < 2) {
          return 0
        } maxBytesToWrite -= 2; const startPtr = outPtr; const numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length; for (let i = 0; i < numCharsToWrite; ++i) {
          const codeUnit = str.charCodeAt(i); HEAP16[outPtr >> 1] = codeUnit; outPtr += 2
        }HEAP16[outPtr >> 1] = 0; return outPtr - startPtr
      }; const lengthBytesUTF16 = str => str.length * 2; const UTF32ToString = (ptr, maxBytesToRead) => {
        let i = 0; let str = ''; while (!(i >= maxBytesToRead / 4)) {
          const utf32 = HEAP32[ptr + i * 4 >> 2]; if (utf32 == 0) {
            break
          } ++i; if (utf32 >= 65_536) {
            const ch = utf32 - 65_536; str += String.fromCharCode(55_296 | ch >> 10, 56_320 | ch & 1023)
          } else {
            str += String.fromCharCode(utf32)
          }
        } return str
      }; const stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
        maxBytesToWrite ??= 2_147_483_647; if (maxBytesToWrite < 4) {
          return 0
        } const startPtr = outPtr; const endPtr = startPtr + maxBytesToWrite - 4; for (let i = 0; i < str.length; ++i) {
          let codeUnit = str.charCodeAt(i); if (codeUnit >= 55_296 && codeUnit <= 57_343) {
            const trailSurrogate = str.charCodeAt(++i); codeUnit = 65_536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023
          }HEAP32[outPtr >> 2] = codeUnit; outPtr += 4; if (outPtr + 4 > endPtr) {
            break
          }
        }HEAP32[outPtr >> 2] = 0; return outPtr - startPtr
      }; const lengthBytesUTF32 = str => {
        let len = 0; for (let i = 0; i < str.length; ++i) {
          const codeUnit = str.charCodeAt(i); if (codeUnit >= 55_296 && codeUnit <= 57_343) {
            ++i
          }len += 4
        } return len
      }; const __embind_register_std_wstring = (rawType, charSize, name) => {
        name = readLatin1String(name); let decodeString, encodeString, readCharAt, lengthBytesUTF; if (charSize === 2) {
          decodeString = UTF16ToString; encodeString = stringToUTF16; lengthBytesUTF = lengthBytesUTF16; readCharAt = pointer => HEAPU16[pointer >> 1]
        } else if (charSize === 4) {
          decodeString = UTF32ToString; encodeString = stringToUTF32; lengthBytesUTF = lengthBytesUTF32; readCharAt = pointer => HEAPU32[pointer >> 2]
        }registerType(rawType, { name, fromWireType: value => {
          const length = HEAPU32[value >> 2]; let str; let decodeStartPtr = value + 4; for (let i = 0; i <= length; ++i) {
            const currentBytePtr = value + 4 + i * charSize; if (i == length || readCharAt(currentBytePtr) == 0) {
              const maxReadBytes = currentBytePtr - decodeStartPtr; const stringSegment = decodeString(decodeStartPtr, maxReadBytes); if (str === undefined) {
                str = stringSegment
              } else {
                str += String.fromCharCode(0); str += stringSegment
              }decodeStartPtr = currentBytePtr + charSize
            }
          }_free(value); return str
        }, toWireType: (destructors, value) => {
          if (!(typeof value == 'string')) {
            throwBindingError(`Cannot pass non-string to C++ string type ${name}`)
          } const length = lengthBytesUTF(value); const ptr = _malloc(4 + length + charSize); HEAPU32[ptr >> 2] = length / charSize; encodeString(value, ptr + 4, length + charSize); if (destructors !== null) {
            destructors.push(_free, ptr)
          } return ptr
        }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction (ptr) {
          _free(ptr)
        } })
      }; const __embind_register_value_object = (rawType, name, constructorSignature, rawConstructor, destructorSignature, rawDestructor) => {
        structRegistrations[rawType] = { name: readLatin1String(name), rawConstructor: embind__requireFunction(constructorSignature, rawConstructor), rawDestructor: embind__requireFunction(destructorSignature, rawDestructor), fields: [] }
      }; const __embind_register_value_object_field = (structType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) => {
        structRegistrations[structType].fields.push({ fieldName: readLatin1String(fieldName), getterReturnType, getter: embind__requireFunction(getterSignature, getter), getterContext, setterArgumentType, setter: embind__requireFunction(setterSignature, setter), setterContext })
      }; const __embind_register_void = (rawType, name) => {
        name = readLatin1String(name); registerType(rawType, { isVoid: true, name, argPackAdvance: 0, fromWireType: () => undefined, toWireType: (destructors, o) => undefined })
      }; const __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num); const emval_returnValue = (returnType, destructorsRef, handle) => {
        const destructors = []; const result = returnType['toWireType'](destructors, handle); if (destructors.length > 0) {
          HEAPU32[destructorsRef >> 2] = Emval.toHandle(destructors)
        } return result
      }; const __emval_as = (handle, returnType, destructorsRef) => {
        handle = Emval.toValue(handle); returnType = requireRegisteredType(returnType, 'emval::as'); return emval_returnValue(returnType, destructorsRef, handle)
      }; const emval_methodCallers = []; const __emval_call = (caller, handle, destructorsRef, args) => {
        caller = emval_methodCallers[caller]; handle = Emval.toValue(handle); return caller(null, handle, destructorsRef, args)
      }; const emval_symbols = {}; const getStringOrSymbol = address => {
        const symbol = emval_symbols[address]; if (symbol === undefined) {
          return readLatin1String(address)
        } return symbol
      }; const __emval_call_method = (caller, objHandle, methodName, destructorsRef, args) => {
        caller = emval_methodCallers[caller]; objHandle = Emval.toValue(objHandle); methodName = getStringOrSymbol(methodName); return caller(objHandle, objHandle[methodName], destructorsRef, args)
      }; const emval_get_global = () => {
        if (typeof globalThis == 'object') {
          return globalThis
        } return (function () {
          return Function
        }())('return this')()
      }; const __emval_get_global = name => {
        if (name === 0) {
          return Emval.toHandle(emval_get_global())
        } else {
          name = getStringOrSymbol(name); return Emval.toHandle(emval_get_global()[name])
        }
      }; const emval_addMethodCaller = caller => {
        const id = emval_methodCallers.length; emval_methodCallers.push(caller); return id
      }; const emval_lookupTypes = (argCount, argTypes) => {
        const a = new Array(argCount); for (let i = 0; i < argCount; ++i) {
          a[i] = requireRegisteredType(HEAPU32[argTypes + i * 4 >> 2], 'parameter ' + i)
        } return a
      }; const reflectConstruct = Reflect.construct; const __emval_get_method_caller = (argCount, argTypes, kind) => {
        const types = emval_lookupTypes(argCount, argTypes); const retType = types.shift(); argCount--; let functionBody = `return function (obj, func, destructorsRef, args) {\n`; let offset = 0; const argsList = []; if (kind === 0) {
          argsList.push('obj')
        } const params = ['retType']; const args = [retType]; for (let i = 0; i < argCount; ++i) {
          argsList.push('arg' + i); params.push('argType' + i); args.push(types[i]); functionBody += `  var arg${i} = argType${i}.readValueFromPointer(args${offset ? '+' + offset : ''});\n`; offset += types[i]['argPackAdvance']
        } const invoker = kind === 1 ? 'new func' : 'func.call'; functionBody += `  var rv = ${invoker}(${argsList.join(', ')});\n`; if (!retType.isVoid) {
          params.push('emval_returnValue'); args.push(emval_returnValue); functionBody += '  return emval_returnValue(retType, destructorsRef, rv);\n'
        }functionBody += '};\n'; params.push(functionBody); const invokerFunction = newFunc(Function, params)(...args); const functionName = `methodCaller<(${types.map(t => t.name).join(', ')}) => ${retType.name}>`; return emval_addMethodCaller(createNamedFunction(functionName, invokerFunction))
      }; const __emval_get_module_property = name => {
        name = getStringOrSymbol(name); return Emval.toHandle(Module[name])
      }; const __emval_get_property = (handle, key) => {
        handle = Emval.toValue(handle); key = Emval.toValue(key); return Emval.toHandle(handle[key])
      }; const __emval_incref = handle => {
        if (handle > 9) {
          emval_handles[handle + 1] += 1
        }
      }; const __emval_new_cstring = v => Emval.toHandle(getStringOrSymbol(v)); const __emval_run_destructors = handle => {
        const destructors = Emval.toValue(handle); runDestructors(destructors); __emval_decref(handle)
      }; const getHeapMax = () => 2_147_483_648; const growMemory = size => {
        const b = wasmMemory.buffer; const pages = (size - b.byteLength + 65_535) / 65_536; try {
          wasmMemory.grow(pages); updateMemoryViews(); return 1
        } catch {}
      }; const _emscripten_resize_heap = requestedSize => {
        const oldSize = HEAPU8.length; requestedSize >>>= 0; const maxHeapSize = getHeapMax(); if (requestedSize > maxHeapSize) {
          return false
        } const alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple; for (let cutDown = 1; cutDown <= 4; cutDown *= 2) {
          let overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100_663_296); const newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65_536)); const replacement = growMemory(newSize); if (replacement) {
            return true
          }
        } return false
      }; const _fd_close = fd => 52; const convertI32PairToI53Checked = (lo, hi) => hi + 2_097_152 >>> 0 < 4_194_305 - !!lo ? (lo >>> 0) + hi * 4_294_967_296 : Number.NaN; function _fd_seek (fd, offset_low, offset_high, whence, newOffset) {
        const offset = convertI32PairToI53Checked(offset_low, offset_high); return 70
      } const printCharBuffers = [null, [], []]; const printChar = (stream, curr) => {
        const buffer = printCharBuffers[stream]; if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0)); buffer.length = 0
        } else {
          buffer.push(curr)
        }
      }; const _fd_write = (fd, iov, iovcnt, pnum) => {
        let num = 0; for (let i = 0; i < iovcnt; i++) {
          const ptr = HEAPU32[iov >> 2]; const len = HEAPU32[iov + 4 >> 2]; iov += 8; for (let j = 0; j < len; j++) {
            printChar(fd, HEAPU8[ptr + j])
          }num += len
        }HEAPU32[pnum >> 2] = num; return 0
      }; InternalError = Module['InternalError'] = class InternalError extends Error {
        constructor (message) {
          super(message); this.name = 'InternalError'
        }
      }; embind_init_charCodes(); BindingError = Module['BindingError'] = class BindingError extends Error {
        constructor (message) {
          super(message); this.name = 'BindingError'
        }
      }; init_ClassHandle(); init_embind(); init_RegisteredPointer(); UnboundTypeError = Module['UnboundTypeError'] = extendError(Error, 'UnboundTypeError'); init_emval(); var wasmImports = { K: ___cxa_throw, G: __abort_js, s: __embind_finalize_value_object, C: __embind_register_bigint, I: __embind_register_bool, w: __embind_register_class, v: __embind_register_class_constructor, d: __embind_register_class_function, m: __embind_register_constant, H: __embind_register_emval, o: __embind_register_enum, a: __embind_register_enum_value, A: __embind_register_float, i: __embind_register_function, l: __embind_register_integer, f: __embind_register_memory_view, z: __embind_register_std_string, u: __embind_register_std_wstring, t: __embind_register_value_object, c: __embind_register_value_object_field, J: __embind_register_void, F: __emscripten_memcpy_js, n: __emval_as, q: __emval_call, p: __emval_call_method, b: __emval_decref, x: __emval_get_global, j: __emval_get_method_caller, r: __emval_get_module_property, g: __emval_get_property, k: __emval_incref, h: __emval_new_cstring, e: __emval_run_destructors, D: _emscripten_resize_heap, E: _fd_close, B: _fd_seek, y: _fd_write }; var wasmExports = createWasm(); let ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports['M'])(); var ___getTypeName = a0 => (___getTypeName = wasmExports['N'])(a0); var _malloc = a0 => (_malloc = wasmExports['O'])(a0); var _free = a0 => (_free = wasmExports['Q'])(a0); var ___cxa_is_pointer_type = a0 => (___cxa_is_pointer_type = wasmExports['R'])(a0); var dynCall_jiji = Module['dynCall_jiji'] = (a0, a1, a2, a3, a4) => (dynCall_jiji = Module['dynCall_jiji'] = wasmExports['S'])(a0, a1, a2, a3, a4); let calledRun; dependenciesFulfilled = function runCaller () {
        if (!calledRun) {
          run()
        } if (!calledRun) {
          dependenciesFulfilled = runCaller
        }
      }; function run () {
        if (runDependencies > 0) {
          return
        }preRun(); if (runDependencies > 0) {
          return
        } function doRun () {
          if (calledRun) {
            return
          } calledRun = true; Module['calledRun'] = true; if (ABORT) {
            return
          } initRuntime(); readyPromiseResolve(Module); Module['onRuntimeInitialized']?.(); postRun()
        } if (Module['setStatus']) {
          Module['setStatus']('Running...'); setTimeout(function () {
            setTimeout(function () {
              Module['setStatus']('')
            }, 1); doRun()
          }, 1)
        } else {
          doRun()
        }
      } if (Module['preInit']) {
        if (typeof Module['preInit'] == 'function') {
          Module['preInit'] = [Module['preInit']]
        } while (Module['preInit'].length > 0) {
          Module['preInit'].pop()()
        }
      }run(); moduleRtn = readyPromise

      return moduleRtn
    }
  )
})()
if (typeof exports === 'object' && typeof module === 'object') {
  module.exports = BASIS
} else if (typeof define === 'function' && define['amd']) {
  define([], () => BASIS)
}
