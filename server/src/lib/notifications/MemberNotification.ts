import { Schema } from '@mysql/xdevapi';
import {
	MemberReference,
	NoSQLDocument,
	NotificationCause,
	NotificationData,
	NotificationMemberCause,
	NotificationMemberTarget,
	NotificationObject,
	NotificationSystemCause
} from 'common-lib';
import { NotificationCauseType, NotificationTargetType } from 'common-lib/index';
import Account from '../Account';
import MemberBase, { resolveReference } from '../Members';
import { Notification } from '../Notification';

export default class MemberNotification extends Notification {
	public static async CreateNotification(
		text: string,
		to: MemberReference | MemberBase,
		from: NotificationSystemCause,
		extraData: NotificationData,
		account: Account,
		schema: Schema
	): Promise<MemberNotification>;
	public static async CreateNotification(
		text: string,
		to: MemberReference | MemberBase,
		from: NotificationMemberCause,
		extraData: NotificationData,
		account: Account,
		schema: Schema,
		fromMember: MemberBase
	): Promise<MemberNotification>;

	public static async CreateNotification(
		text: string,
		to: MemberReference | MemberBase,
		from: NotificationCause,
		extraData: NotificationData,
		account: Account,
		schema: Schema,
		fromMember?: MemberBase
	) {
		const results = await this.Create(
			{
				cause: from,
				text,
				extraData
			},
			{
				type: NotificationTargetType.MEMBER,
				to: to instanceof MemberBase ? to.getReference() : to
			},
			account,
			schema
		);

		let toMemberName: string;

		if (to instanceof MemberBase) {
			toMemberName = to.getFullName();
		} else {
			const toMember = await resolveReference(to, account, schema);

			toMemberName = toMember.getFullName();
		}

		return new MemberNotification(
			{
				...results,
				fromMemberName:
					from.type === NotificationCauseType.MEMBER ? fromMember.getFullName() : null,
				toMemberName
			},
			account,
			schema
		);
	}

	public target: NotificationMemberTarget;

	public constructor(
		data: NotificationObject & Required<NoSQLDocument>,
		account: Account,
		schema: Schema
	) {
		super(data, account, schema);
	}

	public canSee(member: MemberBase, account: Account) {
		return member.matchesReference(this.target.to);
	}
}
