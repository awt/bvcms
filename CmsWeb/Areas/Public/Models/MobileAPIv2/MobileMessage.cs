﻿using System.Web.Mvc;
using Newtonsoft.Json;

namespace CmsWeb.Areas.Public.Models.MobileAPIv2
{
	public class MobileMessage : ActionResult
	{
		public int device = (int) Device.UNKNOW;
		public int version = (int) Version.NONE;

		public bool rebranded = false;

		public int error = 1;
		public int count = 0;

		public int id = 0;

		public int argInt = 0;
		public bool argBool = false;
		public string argString = "";

		public string data = "";
		public string instance = "";
		public string key = "";

		public override void ExecuteResult( ControllerContext context )
		{
			context.HttpContext.Response.ContentType = "application/json";
			context.HttpContext.Response.Output.Write( JsonConvert.SerializeObject( this ) );
		}

		public static MobileMessage createLoginErrorReturn( MobileAuthentication authentication )
		{
			MobileMessage br = new MobileMessage
			{
				error = authentication.getError(),
				data = authentication.getErrorMessage()
			};

			return br;
		}

		public static MobileMessage createErrorReturn( string sErrorMessage, int errorCode = 1 )
		{
			MobileMessage br = new MobileMessage
			{
				data = sErrorMessage,
				error = errorCode
			};

			return br;
		}

		public static MobileMessage createFromString( string json )
		{
			if( !string.IsNullOrEmpty( json ) ) {
				return JsonConvert.DeserializeObject<MobileMessage>( json );
			}

			return new MobileMessage();
		}

		public MobileMessage setData( string data )
		{
			this.data = data;

			return this;
		}

		public void setError( int error )
		{
			this.error = error;
		}

		public void setNoError()
		{
			this.error = (int) Error.NONE;
		}

		public string getSourceOS()
		{
			switch( (Device) device ) {
				case Device.ANDROID: {
					return "Android";
				}

				case Device.IOS: {
					return "iOS";
				}

				default:
					return "Unknown";
			}
		}

		public string getSourceQueryString()
		{
			switch( (Device) device ) {
				case Device.ANDROID: {
					return "source=Android";
				}

				case Device.IOS: {
					return "source=iOS";
				}

				default:
					return "";
			}
		}

		public enum Device
		{
			UNKNOW = 0,
			IOS = 1,
			ANDROID = 2
		}

		public enum Version
		{
			NONE = 0,

			// ONE = 1, // Initial release version
			// TWO = 2, // Version 2 had issues with time zones being sent
			// THREE = 3, // Version 3 has time zone corrections
			// FOUR = 4, // Version 4 added rebrand flag
			// FIVE = 5, // Version 5 added Google Calendar integration
			// SIX = 6, // Version 6 added My Profile section
			SEVEN = 7, // Version 7 is the UX project
		}

		public enum Error
		{
			// Common Errors
			NONE = 0,
			INVALID_INSTANCE_ID = 1,
			INVALID_PIN = 2,

			// Create Errors	
			CREATE_FAILED = 50,

			// People Errors
			PERSON_NOT_FOUND = 100,

			// Tasks Errors
			TASK_UPDATE_FAILED = 201
		}
	}
}