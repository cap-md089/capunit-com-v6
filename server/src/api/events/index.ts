import * as express from 'express';
import Account from '../../lib/Account';
import Event from '../../lib/Event';
import NHQMember from '../../lib/members/NHQMember';
import { replaceUndefinedWithNullMiddleware } from '../../lib/Util';
import Validator from '../../lib/validator/Validator';
import { tokenMiddleware } from '../formtoken';
// Attendance
import addattendance from './attendance/addattendance';
import addattendancebulk, { attendanceBulkValidator } from './attendance/addattendancebulk';
import deleteattendance from './attendance/deleteattendance';
import getattendance from './attendance/getattendance';
import modifyattendance from './attendance/modifyattendance';
// Debrief
import adddebrief from './debrief/adddebrief';
import deletedebrief from './debrief/deletedebrief';
// Event handlers
import addevent from './events/addevent';
import copy from './events/copy';
import deleteevent from './events/deleteevent';
import getevent from './events/getevent';
import getnextrecurring from './events/getnextrecurring';
import linkevent from './events/linkevent';
import list from './events/list';
import listupcoming from './events/listupcoming';
import setevent from './events/setevent';
import timelist from './events/timelist';

const router = express.Router();

router.use(Account.ExpressMiddleware);

router.get('/', NHQMember.ConditionalExpressMiddleware, list);
router.get('/upcoming', listupcoming);
router.get('/recurring', getnextrecurring);
router.get('/:start/:end', NHQMember.ConditionalExpressMiddleware, timelist);
router.post(
	'/',
	NHQMember.ExpressMiddleware,
	tokenMiddleware,
	Validator.BodyExpressMiddleware(Event.Validator),
	NHQMember.PermissionMiddleware('AddEvent'),
	addevent
);
router.post(
	'/:parent',
	NHQMember.ExpressMiddleware,
	tokenMiddleware,
	linkevent
);
router.delete(
	'/:id',
	NHQMember.ExpressMiddleware,
	tokenMiddleware,
	deleteevent
);
router.put(
	'/:id',
	NHQMember.ExpressMiddleware,
	tokenMiddleware,
	Validator.PartialBodyExpressMiddleware(Event.Validator),
	setevent
);
router.get('/:id', NHQMember.ConditionalExpressMiddleware, getevent);
router.post('/:id/copy', NHQMember.ExpressMiddleware, tokenMiddleware, copy);

router.get('/:id/attendance', NHQMember.ExpressMiddleware, getattendance);
router.post(
	'/:id/attendance/bulk',
	NHQMember.ExpressMiddleware,
	replaceUndefinedWithNullMiddleware,
	tokenMiddleware,
	Validator.BodyExpressMiddleware(attendanceBulkValidator),
	addattendancebulk
);
router.post(
	'/:id/attendance',
	NHQMember.ExpressMiddleware,
	replaceUndefinedWithNullMiddleware,
	tokenMiddleware,
	Validator.BodyExpressMiddleware(Event.AttendanceValidator),
	addattendance
);
router.put(
	'/:id/attendance',
	NHQMember.ExpressMiddleware,
	replaceUndefinedWithNullMiddleware,
	tokenMiddleware,
	Validator.BodyExpressMiddleware(Event.AttendanceValidator),
	modifyattendance
);
router.delete('/:id/attendance', NHQMember.ExpressMiddleware, deleteattendance);

router.post(
	'/:id/debrief',
	NHQMember.ExpressMiddleware,
	tokenMiddleware,
	adddebrief
);
router.delete(
	'/:id/debrief/:timestamp',
	NHQMember.ExpressMiddleware,
	tokenMiddleware,
	deletedebrief
);

export default router;
