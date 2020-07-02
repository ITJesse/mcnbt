/**
 * SilentDepth created at 2020-07-01 22:42:20 With ♥
 *
 * Copyright (c) 2020 silent.land, all rights
 * reserved.
 */
var BaseTag = require("../base_tag");
var util = require("util");
var bignum = require("bignum");

var _longBound = {
    min: bignum("-9223372036854775808"),
    max: bignum("9223372036854775807")
};

var TAGLongArray = function() {
    BaseTag.call(this);
    this.type = "TAG_Long_Array";
};

util.inherits(TAGLongArray, BaseTag);

TAGLongArray.prototype._readBodyFromBuffer = function(buff, offset) {
    var len        = buff.readUInt32BE(offset);
    var nextOffset = offset + 4;
    var endOffset  = nextOffset + len * 8;
    this.value     = [];

    for(var i = nextOffset; i < endOffset; i += 8) {
        this.value.push(buff.readBigInt64BE(i));
    }

    return 4 + len * 8;
};

TAGLongArray.prototype.calcBufferLength = function() {
    return 4 + this.value.length * 8;
};

TAGLongArray.prototype.setValue = function(array) {
    if(!Array.isArray(array)) {
        throw new Error("Value of TAG_Long_Array should be an array.");
    }

    var newArray = [];
    for(var i = 0; i < array.length; i++) {
        newArray.push(bignum(array[i]));
        if(newArray[i].lt(_longBound.min) || newArray[i].gt(_longBound.max)) {
            throw new Error("Each element in TAG_Long_Array should between " +
                            "-9223372036854775808 and 9223372036854775807.");
        }
    }

    this.value = newArray;
};

TAGLongArray.prototype.shift = function() {
    return this.value.shift();
};

TAGLongArray.prototype.unshift = function(value) {
    value = bignum(value);
    if(value.lt(_longBound.min) || value.gt(_longBound.max)) {
        throw new Error("Each element in TAG_Long_Array should between " +
                        "-9223372036854775808 and 9223372036854775807.");
    }
    return this.value.unshift(value);
};

TAGLongArray.prototype.push = function(value) {
    value = bignum(value);
    if(value.lt(_longBound.min) || value.gt(_longBound.max)) {
        throw new Error("Each element in TAG_Long_Array should between " +
                        "-9223372036854775808 and 9223372036854775807.");
    }
    return this.value.push(value);
};

TAGLongArray.prototype.pop = function() {
    return this.value.pop();
};

TAGLongArray.prototype.insert = function(value, pos) {
    value = bignum(value);
    if(value.lt(_longBound.min) || value.gt(_longBound.max)) {
        throw new Error("Each element in TAG_Long_Array should between " +
                        "-9223372036854775808 and 9223372036854775807.");
    }
    if(pos < 0) pos = 0;
    if(pos > this.value.length) pos = this.value.length;
    this.value.push([]);
    for(var i = this.value.length - 1; i >= pos; i--) {
        this.value[i + 1] = this.value[i];
    }
    this.value[pos] = value;
};

TAGLongArray.prototype.writeBuffer = function(buff, offset) {
    buff.writeUInt32BE(this.value.length, offset);

    for(var i = 0; i < this.value.length; i++) {
        buff.writeBigInt64BE(this.value[i], offset + 4 + i * 8);
    }

    return 4 + this.value.length * 8;
};

module.exports = TAGLongArray;
