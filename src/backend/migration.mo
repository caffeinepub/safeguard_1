import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Storage "blob-storage/Storage";

module {
  type OldChecklistItem = {
    name : Text;
    completed : Bool;
  };

  type OldSubmission = {
    storeName : Text;
    items : [OldChecklistItem];
    photo : ?Storage.ExternalBlob;
    timestamp : Time.Time;
  };

  type OldActor = {
    submissions : Map.Map<Principal, OldSubmission>;
  };

  // New types to match the updated actor
  type NewChecklistItem = {
    name : Text;
    completed : Bool;
    photo : ?Storage.ExternalBlob;
  };

  type NewSubmission = {
    storeName : Text;
    items : [NewChecklistItem];
    timestamp : Time.Time;
  };

  type NewActor = {
    submissions : Map.Map<Principal, NewSubmission>;
  };

  // Migration function to transform the old actor state to the new one
  public func run(old : OldActor) : NewActor {
    let newSubmissions = old.submissions.map<Principal, OldSubmission, NewSubmission>(
      func(_principal, oldSubmission) {
        let newItems = oldSubmission.items.map(
          func(oldItem) {
            {
              oldItem with
              photo = if (oldSubmission.photo != null) {
                oldSubmission.photo;
              } else {
                null;
              };
            };
          }
        );
        {
          storeName = oldSubmission.storeName;
          items = newItems;
          timestamp = oldSubmission.timestamp;
        };
      }
    );
    { submissions = newSubmissions };
  };
};
