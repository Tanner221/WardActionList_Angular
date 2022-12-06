﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace WardActionList.Areas.Identity.Data;

// Add profile data for application users by adding properties to the WardActionListUser class
public class WardActionListUser : IdentityUser
{
    public string Id { get; set; }
    public string Email { get; set; }
}

