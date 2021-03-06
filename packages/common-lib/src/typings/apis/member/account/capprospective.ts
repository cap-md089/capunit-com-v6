/**
 * Copyright (C) 2020 Andrew Rioux
 *
 * This file is part of EvMPlus.org.
 *
 * This file documents how an admin can manage CAPProspectiveMember accounts
 *
 * See `common-lib/src/typings/api.ts` for more information
 *
 * EvMPlus.org is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * EvMPlus.org is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EvMPlus.org.  If not, see <http://www.gnu.org/licenses/>.
 */

import { APIEither } from '../../../api';
import {
	CAPNHQMemberReference,
	CAPProspectiveMemberPasswordCreation,
	NewCAPProspectiveMember,
} from '../../../types';

interface ProspectiveAccountBody {
	member: NewCAPProspectiveMember;
	login: CAPProspectiveMemberPasswordCreation;
}

/**
 * Allows an admin to create a prospective member for someone else
 */
export interface CreateProspectiveAccount {
	(params: {}, body: ProspectiveAccountBody): APIEither<void>;

	url: '/api/member/account/capprospective/requestaccount';

	method: 'post';

	requiresMember: 'required';

	needsToken: true;

	useValidator: false;
}

/**
 * Allows an admin to make it so that all CAPProspectiveMemberReferences point to a CAPNHQMemberReference
 *
 * `account` is a stringified CAPProspectiveMemberReference
 */
export interface UpgradeProspectiveAccount {
	(params: { account: string }, body: { nhqReference: CAPNHQMemberReference }): APIEither<void>;

	url: '/api/member/account/capprospective/:account';

	method: 'post';

	requiresMember: 'required';

	needsToken: true;

	useValidator: true;
}

/**
 * Allows an admin to delete a Prospective member account
 *
 * `account` is a stringified CAPProspectiveMemberReference
 */
export interface DeleteProspectiveAccount {
	(params: { account: string }, body: {}): APIEither<void>;

	url: '/api/member/account/capprospective/:account';

	method: 'delete';

	requiresMember: 'required';

	needsToken: true;

	useValidator: false;
}
