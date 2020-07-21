/**
 * Copyright (C) 2020 Andrew Rioux
 *
 * This file is part of CAPUnit.com.
 *
 * CAPUnit.com is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * CAPUnit.com is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with CAPUnit.com.  If not, see <http://www.gnu.org/licenses/>.
 */

import { addAPI } from 'auto-client-api';
import { Validator } from 'common-lib';
import * as express from 'express';
import { endpointAdder } from '../../lib/API';
// API routes
import absent from './absent';
import account from './account';
import basic from './attendance/basic';
import other from './attendance/other';
import short from './attendance/short';
// import capwatchimport from './capwatch/importcapwatch';
import flightassign from './flights/flightassign';
import flightassignbulk from './flights/flightassignbulk';
import flightbasic from './flights/flightbasic';
import flightmembers from './flights/flightmembers';
import getmembers from './getmembers';
import passwordreset from './passwordreset';
import getpermissions from './permissions/getpermissions';
import setpermissions from './permissions/setpermissions';
import su from './su';
import getdutypositions from './temporarydutypositions/get';
import setdutypositions from './temporarydutypositions/set';

const router = express.Router();

const adder = endpointAdder(router) as () => () => void;

addAPI(Validator, adder, getmembers);
addAPI(Validator, adder, passwordreset);
addAPI(Validator, adder, absent);
addAPI(Validator, adder, su);

addAPI(Validator, adder, getdutypositions);
addAPI(Validator, adder, setdutypositions);

addAPI(Validator, adder, setpermissions);
addAPI(Validator, adder, getpermissions);

addAPI(Validator, adder, flightassign);
addAPI(Validator, adder, flightassignbulk);
addAPI(Validator, adder, flightbasic);
addAPI(Validator, adder, flightmembers);

// addAPI(Validator, adder, capwatchimport);

addAPI(Validator, adder, basic);
addAPI(Validator, adder, short);
addAPI(Validator, adder, other);

router.use(account);

export default router;