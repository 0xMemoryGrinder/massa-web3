import { bytesToF32, bytesToF64, bytesToI32, bytesToI64, bytesToStr, bytesToU32, bytesToU64, byteToU8, f32ToBytes, f64ToBytes, i32ToBytes, i64ToBytes, strToBytes, u32ToBytes, u64ToBytes, u8toByte, serializableObjectsArrayToBytes, deserializeObj, bytesToSerializableObjectArray, nativeTypeArrayToBytes, bytesToNativeTypeArray, } from './serializers';
/**
 * Typed Arguments facilitating the differentiation
 * between different argument types due to Javascript's
 * single number type.
 *
 * @remark In Assemblyscript the latter are all native types
 */
export var TypedArrayUnit;
(function (TypedArrayUnit) {
    TypedArrayUnit[TypedArrayUnit["STRING"] = 0] = "STRING";
    TypedArrayUnit[TypedArrayUnit["BOOL"] = 1] = "BOOL";
    TypedArrayUnit[TypedArrayUnit["U8"] = 2] = "U8";
    TypedArrayUnit[TypedArrayUnit["U32"] = 3] = "U32";
    TypedArrayUnit[TypedArrayUnit["U64"] = 4] = "U64";
    TypedArrayUnit[TypedArrayUnit["I32"] = 5] = "I32";
    TypedArrayUnit[TypedArrayUnit["I64"] = 6] = "I64";
    TypedArrayUnit[TypedArrayUnit["F32"] = 7] = "F32";
    TypedArrayUnit[TypedArrayUnit["F64"] = 8] = "F64";
})(TypedArrayUnit || (TypedArrayUnit = {}));
/**
 * Args for remote function call.
 *
 * This class can serialize javascript native types into bytes, in order to
 * make smart-contract function call easier.
 *
 */
export class Args {
    offset = 0;
    serialized;
    /**
     *
     * @param {string} serialized
     */
    constructor(serialized = [], offset = 0) {
        this.serialized = Uint8Array.from(serialized);
        this.offset = offset;
    }
    /**
     * Returns the current offset
     *
     * @returns {number} the current offset
     */
    getOffset() {
        return this.offset;
    }
    /**
     * Returns the serialized array to pass to CallSC.
     *
     * @returns the serialized array
     */
    serialize() {
        return Array.from(this.serialized);
    }
    // Getters
    /**
     * Returns the deserialized string.
     *
     * @returns the deserialized string
     */
    nextString() {
        const length = this.nextU32();
        const end = this.offset + length;
        const result = bytesToStr(this.serialized.slice(this.offset, end));
        this.offset = end;
        return result;
    }
    /**
     * Returns the deserialized number.
     *
     * @returns
     */
    nextU8() {
        const value = byteToU8(this.serialized, this.offset);
        this.offset++;
        return BigInt(value);
    }
    /**
     * Returns the deserialized number.
     *
     * @return {number}
     */
    nextU32() {
        const value = bytesToU32(this.serialized, this.offset);
        this.offset += 4;
        return value;
    }
    /**
     * Returns the deserialized number.
     *
     * @return {BigInt}
     */
    nextU64() {
        const value = bytesToU64(this.serialized, this.offset);
        this.offset += 8;
        return value;
    }
    /**
     * Returns the deserialized boolean
     */
    nextBool() {
        return !!this.serialized[this.offset++];
    }
    /**
     * Returns the deserialized number.
     *
     * @return {number}
     */
    nextI32() {
        const value = bytesToI32(this.serialized, this.offset);
        this.offset += 4;
        return value;
    }
    /**
     * Returns the deserialized number.
     *
     * @return {BigInt}
     */
    nextI64() {
        const value = bytesToI64(this.serialized, this.offset);
        this.offset += 8;
        return BigInt(value);
    }
    /**
     * Returns the deserialized number.
     *
     * @return {number}
     */
    nextF32() {
        const value = bytesToF32(this.serialized, this.offset);
        this.offset += 4;
        return value;
    }
    /**
     * Returns the deserialized number.
     *
     * @return {number}
     */
    nextF64() {
        const value = bytesToF64(this.serialized, this.offset);
        this.offset += 8;
        return value;
    }
    /**
     * @return {Uint8Array} bytearray
     */
    nextUint8Array() {
        const length = this.nextU32();
        const byteArray = this.serialized.slice(this.offset, this.offset + length);
        this.offset += length;
        return byteArray;
    }
    /**
     * This function deserialize an object implementing ISerializable
     *
     * @param Clazz - the class constructor prototype T.prototype
     * @returns the deserialized object T
     */
    nextSerializable(Clazz) {
        let deserializationResult = deserializeObj(this.serialized, this.offset, Clazz);
        this.offset = deserializationResult.offset;
        return deserializationResult.instance;
    }
    /**
     * @returns the deserialized array of object that implement ISerializable
     */
    nextSerializableObjectArray(Clazz) {
        const length = this.nextU32();
        if (this.offset + length > this.serialized.length) {
            throw new Error("can't deserialize length of array from given argument");
        }
        const bufferSize = length;
        if (bufferSize === 0) {
            return [];
        }
        const buffer = this.getNextData(bufferSize);
        const value = bytesToSerializableObjectArray(buffer, Clazz);
        this.offset += bufferSize;
        return value;
    }
    /**
     * @returns the next array of object that are native type
     */
    nextNativeTypeArray(typedArrayType) {
        const length = this.nextU32();
        if (this.offset + length > this.serialized.length) {
            throw new Error("can't deserialize length of array from given argument");
        }
        const bufferSize = length;
        if (bufferSize === 0) {
            return [];
        }
        const buffer = this.getNextData(bufferSize);
        const value = bytesToNativeTypeArray(buffer, typedArrayType);
        this.offset += bufferSize;
        return value;
    }
    // Setter
    /**
     *
     * @param {number} value
     * @return {Args}
     */
    addU8(value) {
        this.serialized = this.concatArrays(this.serialized, u8toByte(value));
        this.offset++;
        return this;
    }
    /**
     *
     * @param {boolean} value
     * @return {Args}
     */
    addBool(value) {
        this.serialized = this.concatArrays(this.serialized, u8toByte(value ? 1 : 0));
        this.offset++;
        return this;
    }
    /**
     *
     * @param {number} value
     * @return {Args}
     */
    addU32(value) {
        this.serialized = this.concatArrays(this.serialized, u32ToBytes(value));
        this.offset += 4;
        return this;
    }
    /**
     *
     * @param {BigInt} bigInt
     * @return {Args}
     */
    addU64(bigInt) {
        this.serialized = this.concatArrays(this.serialized, u64ToBytes(bigInt));
        this.offset += 8;
        return this;
    }
    /**
     *
     * @param {number} value
     * @return {Args}
     */
    addI32(value) {
        this.serialized = this.concatArrays(this.serialized, i32ToBytes(value));
        this.offset += 4;
        return this;
    }
    /**
     *
     * @param {BigInt} bigInt
     * @return {Args}
     */
    addI64(bigInt) {
        this.serialized = this.concatArrays(this.serialized, i64ToBytes(bigInt));
        this.offset += 8;
        return this;
    }
    /**
     *
     * @param {number} value
     * @return {Args}
     */
    addF32(value) {
        this.serialized = this.concatArrays(this.serialized, f32ToBytes(value));
        this.offset += 4;
        return this;
    }
    /**
     *
     * @param {number} value
     * @return {Args}
     */
    addF64(value) {
        this.serialized = this.concatArrays(this.serialized, f64ToBytes(value));
        this.offset += 8;
        return this;
    }
    /**
     *
     * @param {Uint8Array} array
     * @return {Args}
     */
    addUint8Array(array) {
        this.addU32(array.length);
        this.serialized = this.concatArrays(this.serialized, array);
        this.offset += array.length;
        return this;
    }
    /**
     * Adds an argument to the serialized byte string if the argument is an
     * instance of a handled type (String of 4294967295 characters maximum)
     *
     * @param {string} arg the argument to add
     *
     * @return {Args} the modified Arg instance
     */
    addString(arg) {
        const maxSize = 4294967295;
        const size = arg.length;
        if (size > maxSize) {
            console.warn('input string is too long, it will be truncated');
            arg = arg.slice(0, maxSize);
        }
        const serialized = strToBytes(arg);
        this.addU32(serialized.length);
        this.serialized = this.concatArrays(this.serialized, strToBytes(arg));
        return this;
    }
    /**
     * Adds a serializable object that implements the ISerializable interface
     *
     * @param {ISerializable} the argument to add
     * @return {Args} the modified Arg instance
     */
    addSerializable(value) {
        const serializedValue = value.serialize();
        this.serialized = this.concatArrays(this.serialized, serializedValue);
        this.offset += serializedValue.length;
        return this;
    }
    /**
     * Adds an array of element that implement `ISerializable`.
     *
     * @remarks
     * This will perform a deep copy of your objects thanks to the `serialize` method you define in your class.
     *
     * @see {@link ISerializable}
     *
     * @param arg - the argument to add
     * @returns the modified Arg instance
     */
    addSerializableObjectArray(arg) {
        const content = serializableObjectsArrayToBytes(arg);
        this.addU32(content.length);
        this.serialized = this.concatArrays(this.serialized, content);
        return this;
    }
    /**
     * Adds an array.
     *
     * @remarks
     * If the type of the values of the array is not native type, this will serialize the pointers, which is certainly not
     * what you want. You can only serialize properly array of native types or array of `Serializable` object.
     *
     * @see {@link addSerializableObjectArray}
     *
     * @param arg - the argument to add
     * @returns the modified Arg instance
     */
    addNativeTypeArray(arg, type) {
        const content = nativeTypeArrayToBytes(arg, type);
        this.addU32(content.length);
        this.serialized = this.concatArrays(this.serialized, content);
        return this;
    }
    // Utils
    /**
     * Internal function to concat to Uint8Array.
     *
     * @param {Uint8Array} a first array to concat
     * @param {Uint8Array | ArrayBuffer} b second array to concat
     *
     * @return {Uint8Array} the concatenated array
     */
    concatArrays(a, b) {
        return new Uint8Array([...a, ...b]);
    }
    /**
     * Returns the data of requested size for current offset
     *
     * @param size - The data size
     * @return {Uint8Array} the slice of the serialized internal buffer
     */
    getNextData(size) {
        return this.serialized.slice(this.offset, this.offset + size);
    }
}
//# sourceMappingURL=arguments.js.map