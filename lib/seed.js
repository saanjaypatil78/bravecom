"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Seed script to populate the database with sample users,
 * referral chains (6 levels deep), and investments.
 */
require("dotenv/config");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var root, userNames, previousLevelUsers, investmentAmounts, level, currentLevelUsers, i, parentUser, user, totalUsers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Seeding Sunray MLM database...");
                    // Clear existing data
                    return [4 /*yield*/, prisma.commissionLog.deleteMany()];
                case 1:
                    // Clear existing data
                    _a.sent();
                    return [4 /*yield*/, prisma.investment.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.referral.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: { name: "Arjun Mehta", role: "FRANCHISE_PARTNER", walletBalance: 1245000 },
                        })];
                case 5:
                    root = _a.sent();
                    console.log("  Root: " + root.name);
                    userNames = [
                        ["Priya Singh", "Rohan Das", "Sneha Rao"],
                        ["Vikram Patel", "Ananya Joshi"],
                        ["Deepak Kumar", "Nisha Verma"],
                        ["Arun Sharma"],
                        ["Meera Gupta"],
                        ["Suresh Reddy"],
                    ];
                    previousLevelUsers = [root];
                    investmentAmounts = [500000, 300000, 200000, 150000, 100000, 75000];
                    level = 0;
                    _a.label = 6;
                case 6:
                    if (!(level < userNames.length)) return [3 /*break*/, 14];
                    currentLevelUsers = [];
                    i = 0;
                    _a.label = 7;
                case 7:
                    if (!(i < userNames[level].length)) return [3 /*break*/, 12];
                    parentUser = previousLevelUsers[i % previousLevelUsers.length];
                    return [4 /*yield*/, prisma.user.create({
                            data: { name: userNames[level][i], role: "INVESTOR", walletBalance: 0 },
                        })];
                case 8:
                    user = _a.sent();
                    return [4 /*yield*/, prisma.referral.create({
                            data: {
                                referrerId: parentUser.id,
                                referredUserId: user.id,
                                level: level + 1,
                            },
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, prisma.investment.create({
                            data: {
                                userId: user.id,
                                amount: investmentAmounts[level],
                                startDate: new Date(Date.now() - 46 * 86400000),
                                status: "ACTIVE",
                            },
                        })];
                case 10:
                    _a.sent();
                    console.log("  L" + (level + 1) + ": " + user.name + " -> referred by " + parentUser.name);
                    currentLevelUsers.push(user);
                    _a.label = 11;
                case 11:
                    i++;
                    return [3 /*break*/, 7];
                case 12:
                    previousLevelUsers = currentLevelUsers;
                    _a.label = 13;
                case 13:
                    level++;
                    return [3 /*break*/, 6];
                case 14: return [4 /*yield*/, prisma.user.count()];
                case 15:
                    totalUsers = _a.sent();
                    console.log("Seeding complete! " + totalUsers + " users created.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
